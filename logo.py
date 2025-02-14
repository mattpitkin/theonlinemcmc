from bilby.core.prior.joint import MultivariateGaussianDist
import numpy as np
from matplotlib import pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from scipy.stats import gaussian_kde


np.random.seed(23)

weights = [0.4, 0.7, 0.3]
means = [[1, 1], [1.2, 0.5], [0.3, 1.2]]
sigmas = [[1.1, 0.6], [0.7, 1.3], [0.9, 1.2]]
corrcoefs = [[[1, 0.3], [0.3, 1]], [[1, -0.5], [-0.5, 1]], [[1, 0.2], [0.2, 1]]]

dist = MultivariateGaussianDist(
    ["x", "y"],
    nmodes=3,
    mus=means,
    sigmas=sigmas,
    weights=weights,
    corrcoefs=corrcoefs,
)

nsamples = 5000
dist.sample(nsamples)
samples = np.vstack([dist.current_sample["x"], dist.current_sample["y"]])

kde = gaussian_kde(samples)

xgrid = np.linspace(-1, 3, 40)
ygrid = np.linspace(-1, 3, 40)
Xgrid, Ygrid = np.meshgrid(xgrid, ygrid)

Z = kde.evaluate(np.vstack([Xgrid.ravel(), Ygrid.ravel()]))
Z = Z.reshape(Xgrid.shape)

mosaic = """A.
            BC"""
fig = plt.figure(
    figsize=(5, 5),
    layout="constrained",
)
axd = fig.subplot_mosaic(
    mosaic,
    gridspec_kw={
        "width_ratios": [3, 1],
        "height_ratios": [1, 3],
        "hspace": 0.1,
        "wspace": 0.1,
    },
)

alpha = 0.5
cmap = "hot_r"

contours = axd["B"].contour(
    Xgrid, Ygrid, Z, 3, colors="black", linewidths=10, linestyles=["-", "-", "--"]
)
axd["B"].imshow(
    Z, origin="lower", extent=[-1, 3, -1, 3], cmap=cmap, alpha=alpha
)  # , interpolation="bilinear")

cdist = Z.sum(axis=1)
adist = Z.sum(axis=0)

for ax in ["A", "B", "C"]:
    axd[ax].spines[["right", "top"]].set_visible(False)
    axd[ax].spines[["left", "bottom"]].set_linewidth(14)
    axd[ax].spines[["left", "bottom"]].set_capstyle("round")
    axd[ax].tick_params(
        axis="both", bottom=False, left=False, labelbottom=False, labelleft=False
    )

# add density to marginal pdfs
for ax, grid, dist, fbfunc in zip(
    ["A", "C"],
    [xgrid, ygrid],
    [adist, cdist],
    [axd["A"].fill_between, axd["C"].fill_betweenx],
):
    patch = fbfunc(grid, dist, linewidth=10, edgecolor="k", facecolor="none")

    # add a bit of padding to avoid thick lines being cropped
    if ax == "A":
        axd[ax].set_ylim(0.0, dist.max() * 1.1)
    else:
        axd[ax].set_xlim(0.0, dist.max() * 1.1)

    extent = patch.get_datalim(axd[ax].transData)
    path = PathPatch(
        Path(patch.get_paths()[0].vertices), facecolor="none", edgecolor="none"
    )
    axd[ax].add_patch(path)

    img = axd[ax].imshow(
        dist.reshape((1, len(dist)) if ax == "A" else (len(dist), 1)),
        origin="lower",
        extent=[extent.xmin, extent.xmax, extent.ymin, extent.ymax],
        cmap=cmap,
        aspect="auto",
        clip_path=path,
        alpha=alpha,
        interpolation="bilinear",
    )

# add padding to avoid cropping of lines
fig.get_layout_engine().set(w_pad=0.15, h_pad=0.15)

fig.savefig("logo.png", dpi=150, transparent=True)
