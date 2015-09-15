<!-- script for facebook sharing -->

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.4";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<!-- script for twitter sharing -->
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>

<!-- script for Google+ sharing -->
<script src="https://apis.google.com/js/platform.js" async defer>
  {lang: 'en-GB'}
</script>

<div class="social">
<table>
<tr>
<td><div class="fb-share-button" data-href="<?php echo $shareurl;?>" data-layout="button_count"></div></td>
<td><a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $shareurl;?>" data-via="theonlinemcmc">Tweet</a></td>
<td><div class="g-plus" data-action="share" data-annotation="bubble" data-href="<?php echo $shareurl;?>"></div></td>
</tr>
</table>
</div>
