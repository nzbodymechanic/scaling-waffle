var wpFollowButton;(function($){var cookies=document.cookie.split(/;\s*/),cookie=false;for(i=0;i<cookies.length;i++){if(cookies[i].match(/^wp_api=/)){cookies=cookies[i].split('=');cookie=cookies[1];break;}}
wpFollowButton={enable:function(){$('a.wpcom-follow, a.wpcom-following').click(function(e){e.preventDefault();var link=$(this);var blog_id=link.data('id');var blog_url=link.data('url');var is_following=link.hasClass('wpcom-following');if(blog_id){var f_id=blog_id;}else{var ln_classes=link.attr('class').split(' ');for(i=0;i<ln_classes.length;i++){if(0==ln_classes[i].indexOf('f-')){var f_id=ln_classes[i].slice(2,ln_classes[i].length);}}}
if(is_following){var action='ab_unsubscribe_from_blog';}else{var action='ab_subscribe_to_blog';}
var elem=$('a.f-'+f_id);if(is_following){elem.fadeOut('fast',function(){elem.removeClass('wpcom-following').addClass('wpcom-follow').text('Follow');elem.fadeIn('fast');})}else{elem.fadeOut('fast',function(){elem.addClass('wpcom-following').removeClass('wpcom-follow').text('Following');elem.fadeIn('fast');})}
var href=link.attr('href');var params=href.split('\?');var domain=params[0];var flds='undefined'!=typeof params[1]?params[1].split('&'):[];for(var i=0;i<flds.length;i++){var pos=flds[i].indexOf('=');if(-1==pos)continue;var argname=flds[i].substring(0,pos);var value=flds[i].substring(pos+1);if(argname=='_wpnonce'){var nonce=value;}else if(argname=='src'){var source=value;}}
$.post(domain+'wp-admin/admin-ajax.php',{'action':action,'_wpnonce':nonce,'blog_id':blog_id,'blog_url':blog_url,'source':source},function(response){if('object'==typeof response.errors){if(is_following)
elem.removeClass('wpcom-follow').addClass('wpcom-following').text('Following');else
elem.removeClass('wpcom-following').addClass('wpcom-follow').text('Follow');}},'json');});},enable_rest:function(el,source){var t=this;el.unbind('click').bind('click',function(e){e.preventDefault();var link=$(this);var blog_id=link.attr('data-blog-id');var is_following=link.hasClass('wpcom-following-rest');var rest_path='/sites/'+blog_id+'/follows/new';if(is_following){rest_path='/sites/'+blog_id+'/follows/mine/delete';}
var attr_selector='data-blog-id="'+blog_id+'"';var elem=$('a.wpcom-follow-rest['+attr_selector+'], a.wpcom-following-rest['+attr_selector+']');if(is_following){elem.fadeOut('fast',function(){elem.removeClass('wpcom-following-rest').addClass('wpcom-follow-rest').text(link.attr('data-follow-text'));elem.fadeIn('fast');})}else{elem.fadeOut('fast',function(){elem.addClass('wpcom-following-rest').removeClass('wpcom-follow-rest').text(link.attr('data-following-text'));elem.fadeIn('fast');})}
t.ajax({type:'POST',path:rest_path,success:function(res){if(!res.success){if(is_following)
elem.removeClass('wpcom-follow-rest').addClass('wpcom-following-rest').text(link.attr('data-following-text'));else
elem.removeClass('wpcom-following-rest').addClass('wpcom-follow-rest').text(link.attr('data-follow-text'));}},error:function(res){if(is_following)
elem.removeClass('wpcom-follow-rest').addClass('wpcom-following-rest').text(link.attr('data-following-text'));else
elem.removeClass('wpcom-following-rest').addClass('wpcom-follow-rest').text(link.attr('data-follow-text'));}});if(!is_following){t.showBubble(link);t.bumpStat(link.attr('data-stat-src'));}});el.hover(function(){var link=$(this);var is_following=link.hasClass('wpcom-following-rest');if(is_following)
link.text(link.attr('data-following-hover-text'));},function(){var link=$(this);var is_following=link.hasClass('wpcom-following-rest');if(is_following)
link.text(link.attr('data-following-text'));});},showBubble:function(link){var pos=link.position();var hideBubble=this.hideBubble;$('div.bubble-txt','div.action-bubble').html("New posts from this blog will now appear in <a href='http://wordpress.com/read/following/' onclick='hideBubble()'>your reader</a>.");var bubble=$('div.action-bubble');link.parent().append(bubble);var left=pos.left+(link.width()/2)-($('div.wpcom-bubble').width()/2);var top=pos.top+bubble.height();bubble.css({left:left+'px',top:top+'px'});bubble.addClass('fadein');setTimeout(function(){$('body').on('click.bubble touchstart.bubble',function(e){if(!$(e.target).hasClass('action-bubble')&&!$(e.target).parents('div.action-bubble').length)
hideBubble();});$(document).on('scroll.bubble',hideBubble);setTimeout(hideBubble,10000);},500);},hideBubble:function(){$('div.wpcom-bubble.action-bubble').remove();},create:function(data,source){var is_following=data['params']['is_following'];var follow_link=$('<a></a>',{'class':(is_following?'wpcom-following-rest':'wpcom-follow-rest'),href:'http://public-api.wordpress.com/sites/'+data['params']['site_id']+'/follows',title:data['params']['blog_title']+
' ('+data['params']['blog_domain']+')',text:is_following?data['params']['following-text']:data['params']['follow-text']}).attr({'data-blog-id':data['params']['site_id'],'data-stat-src':data['params']['stat-source'],'data-follow-text':data['params']['follow-text'],'data-following-text':data['params']['following-text'],'data-following-hover-text':data['params']['following-hover-text']});var follow_button=$('<div></div>',{'class':'wpcom-follow-container wpcom-follow-attached',style:'display: inline-block;'}).append(follow_link);this.enable_rest(follow_link,source);return follow_button;},createAll:function(){$('.wpcom-follow-container').not('.wpcom-follow-attached').each(function(index){var el=$(this);el.replaceWith(wpFollowButton.create(el.data('json'),el.data('follow-source')));});},ajax:function(options){if(document.location.host=='public-api.wordpress.com'){$.ajaxSetup({beforeSend:function(xhr){if(cookie){xhr.setRequestHeader('Authorization','X-WPCOOKIE '+cookie+':1:'+document.location.host);}}});var request={type:options.type,url:'https://public-api.wordpress.com/rest/v1'+options.path,success:options.success,error:options.error,data:options.data,dataType:'json'};$.ajax(request);$.ajaxSetup({beforeSend:null});}else{var request={path:options.path,method:options.type};if(request.method==="POST")
request.body=options.data;else
request.query=options.data;$.wpcom_proxy_request(request).done(function(response,statusCode){if(200==statusCode)
options.success(response);else
options.error(statusCode);});}},bumpStat:function(source){new Image().src=document.location.protocol+
'//pixel.wp.com/g.gif?v=wpcom-no-pv&x_follow_source='+encodeURIComponent(source)+'&baba='+Math.random();}};$(function(){wpFollowButton.enable()
wpFollowButton.createAll()});})(jQuery);