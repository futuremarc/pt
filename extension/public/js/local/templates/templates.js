this.Templates=this.Templates||{},this.Templates.auth=this.Templates.auth||{},this.Templates.auth.addFriendRequests=Handlebars.template({1:function(n,l,a,e,t){var i;return"\n    <form id='pt-requests-form'>\n\n      <ul>\n"+(null!=(i=a.each.call(null!=l?l:{},l,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,l,a,e,t){var i,s=null!=l?l:{},u=a.helperMissing,r="function",o=n.escapeExpression;return"\n          <li data-id='"+o((i=null!=(i=a._id||(null!=l?l._id:l))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"'>\n          \n            <div>\n              "+o((i=null!=(i=a.name||(null!=l?l.name:l))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"\n            </div>\n\n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-role='request' data-action='accept', data-name='"+o((i=null!=(i=a.name||(null!=l?l.name:l))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=a._id||(null!=l?l._id:l))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Accept'>\n              </li>\n\n              <li>\n                <input type='submit' data-role='request' data-action='reject', data-name='"+o((i=null!=(i=a.name||(null!=l?l.name:l))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=a._id||(null!=l?l._id:l))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Reject'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,l,a,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i;return"<h3>Friend Requests</h3>\n\n\n<div class='pt-auth-container'>\n\n"+(null!=(i=a.if.call(null!=l?l:{},l,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>\n"},useData:!0}),this.Templates.auth.addFriendsList=Handlebars.template({1:function(n,l,a,e,t){var i;return"\n    <form id='pt-friends-form'>\n\n      <ul>\n"+(null!=(i=a.each.call(null!=l?l:{},l,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"\n          <li data-id='"+u(s(null!=(i=null!=l?l.user:l)?i._id:i,l))+"'>\n\n            <div>\n              "+u(s(null!=(i=null!=l?l.user:l)?i.name:i,l))+"\n            </div>\n            \n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-action='remove', data-role='request', data-name='"+u(s(null!=(i=null!=l?l.user:l)?i.name:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.user:l)?i._id:i,l))+"', class='btn btn-custom friends-list-btn', value='Remove'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,l,a,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i;return"\n<h3>Friends</h3>\n\n<div class='pt-auth-container'>\n\n"+(null!=(i=a.if.call(null!=l?l:{},l,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>"},useData:!0}),this.Templates.auth.addSubscriptions=Handlebars.template({1:function(n,l,a,e,t,i,s){var u;return"\n  <ul>\n"+(null!=(u=a.each.call(null!=l?l:{},null!=l?l.subscriptions:l,{name:"each",hash:{},fn:n.program(2,t,0,i,s),inverse:n.noop,data:t}))?u:"")+"  </ul>\n  </br>\n\n"},2:function(n,l,a,e,t,i,s){var u,r,o=null!=l?l:{},d=a.helperMissing,m=n.escapeExpression;return'\n      <li>\n\n        <div class="checkbox">\n\n          <label>\n            <input type="checkbox", data-id=\''+m((r=null!=(r=a._id||(null!=l?l._id:l))?r:d,"function"==typeof r?r.call(o,{name:"_id",hash:{},data:t}):r))+"', data-role='subscription', data-title=\""+m((r=null!=(r=a.title||(null!=l?l.title:l))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+'", '+(null!=(u=a.if.call(o,null!=s[1]?s[1].mySubscriptions:s[1],{name:"if",hash:{},fn:n.program(3,t,0,i,s),inverse:n.noop,data:t}))?u:"")+' value="">\n            '+m((r=null!=(r=a.title||(null!=l?l.title:l))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+"\n          </label>\n          \n        </div>\n\n      </li>\n      \n"},3:function(n,l,a,e,t,i,s){var u;return" "+(null!=(u=(a.ifIn||l&&l.ifIn||a.helperMissing).call(null!=l?l:{},null!=l?l._id:l,null!=s[1]?s[1].mySubscriptions:s[1],{name:"ifIn",hash:{},fn:n.program(4,t,0,i,s),inverse:n.noop,data:t}))?u:"")+" "},4:function(n,l,a,e,t){return"checked"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t,i,s){var u;return"<h4>A service automatically shares when you're on a participating website.</h4><h6 class='sub-text'> Choose which services you want enabled.</h6>\n\n"+(null!=(u=a.if.call(null!=l?l:{},l,{name:"if",hash:{},fn:n.program(1,t,0,i,s),inverse:n.noop,data:t}))?u:"")},useData:!0,useDepths:!0}),this.Templates.auth.addSuggestions=Handlebars.template({1:function(n,l,a,e,t){var i;return"\n    <form id='pt-suggestions-form'>\n\n      <ul>\n"+(null!=(i=a.each.call(null!=l?l:{},l,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,l,a,e,t){var i,s=null!=l?l:{},u=a.helperMissing,r=n.escapeExpression;return"\n          <li>\n\n            <div>\n              "+r((i=null!=(i=a.name||(null!=l?l.name:l))?i:u,"function"==typeof i?i.call(s,{name:"name",hash:{},data:t}):i))+"\n            </div>\n            \n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-action='request', data-role='suggestion', data-name='"+r((i=null!=(i=a.name||(null!=l?l.name:l))?i:u,"function"==typeof i?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+r((i=null!=(i=a._id||(null!=l?l._id:l))?i:u,"function"==typeof i?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom suggested-friend-btn', value='Add'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,l,a,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i;return"<h3>People you might know</h3>\n\n<div class='pt-auth-container'>\n\n"+(null!=(i=a.if.call(null!=l?l:{},l,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>"},useData:!0}),this.Templates.extension=this.Templates.extension||{},this.Templates.extension.addList=Handlebars.template({1:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return'\n    <li data-room="'+u(s(null!=(i=null!=(i=null!=l?l.user:l)?i.room:i)?i._id:i,l))+'" onclick="location.href = \'/room/'+u(s(null!=(i=null!=(i=null!=l?l.user:l)?i.room:i)?i.title:i,l))+"';\">\n      "+u(s(null!=(i=null!=(i=null!=l?l.user:l)?i.room:i)?i.title:i,l))+"\n    </li>\n\n"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i;return"<ul>\n"+(null!=(i=a.each.call(null!=l?l:{},l,{name:"each",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n</ul>"},useData:!0}),this.Templates.extension.addMenu=Handlebars.template({1:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"\t\t  <li class='pt-menu-home pt-menu-item'>\n\n\t\t    <div data-role='home', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>Friend requests</div>\n"+(null!=(i=(a.ifCond||l&&l.ifCond||a.helperMissing).call(null!=l?l:{},null!=(i=null!=(i=null!=l?l.data:l)?i.friendRequests:i)?i.length:i,">",0,{name:"ifCond",hash:{},fn:n.program(2,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\t\t  </li>\n"},2:function(n,l,a,e,t){var i;return"          <span class='pt-notification-counter' style='display:block'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=l?l.data:l)?i.friendRequests:i)?i.length:i,l))+"</span>\n"},4:function(n,l,a,e,t){var i;return"           <span class='pt-notification-counter'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=l?l.data:l)?i.friendRequests:i)?i.length:i,l))+"</span>\n"},6:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"  \t\t<li class='pt-menu-friend pt-menu-item' >\n    \t\t<div data-role='friend', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>Find your friends</div>\n  \t\t</li>\n"},8:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"      <li>\n        <div class='pt-menu-share', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-role='share', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>Share this page</div>\n      </li>\n"},10:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"      <li class='pt-menu-suggestions pt-menu-item'>\n        <div data-role='suggestions', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>People you might know</div>\n      </li>\n"},12:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"    <li class='pt-menu-feedback pt-menu-item'>\n      <div data-role='feedback', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>Bug report and feature request</div>\n    </li>\n"},14:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"    <li class='pt-menu-item'>\n      <div data-role='settings', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"'>Settings</div>\n    </li>\n"},16:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"    <li>\n      <div data-role='zoom-out', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"' class='pt-menu-zoom' style='display:inline' >🔍 -</div>\n      <span> / </span>\n      <div data-role='zoom-in', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-id='"+u(s(null!=(i=null!=l?l.data:l)?i._id:i,l))+"' class='pt-menu-zoom' style='display:inline' >🔍 +</div>\n    </li>\n"},18:function(n,l,a,e,t){var i;return"    <li class='pt-menu-hide-pt'>\n      <div data-role='hide-pt', data-room='"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"'>Hide scene</div>\n    </li>\n"},20:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return"    <li class='pt-menu-hide'>\n      <div data-role='hide-pt', data-room='"+u(s(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"'>Hide "+u(s(null!=(i=null!=l?l.data:l)?i.name:i,l))+"</div>\n    </li>\n"},22:function(n,l,a,e,t){var i;return"      <span> / </span>\n      <div class='pt-menu-hide-pt', data-role='hide-pt', data-room='"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', style='display:inline'>Hide scene</div>\n"},24:function(n,l,a,e,t){var i;return"    <li cl>\n      <div class='pt-return-home', style='display:none', data-room='"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', data-role='return-home'>Return home</div>\n    </li>\n"},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i,s,u=n.lambda,r=n.escapeExpression,o=null!=l?l:{},d=a.helperMissing;return"<ul data-id='"+r(u(null!=(i=null!=l?l.data:l)?i._id:i,l))+"',  data-name='"+r(u(null!=(i=null!=l?l.data:l)?i.name:i,l))+"', data-is-me='"+r((s=null!=(s=a.isMe||(null!=l?l.isMe:l))?s:d,"function"==typeof s?s.call(o,{name:"isMe",hash:{},data:t}):s))+"'>\n\n  <li class='pt-room pt-menu-item' >\n    <div data-role='room', data-id='"+r(u(null!=(i=null!=l?l.data:l)?i._id:i,l))+"', data-room='"+r(u(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"'>Chat</div>\n  </li>\n\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(6,t,0),inverse:n.noop,data:t}))?i:"")+"\n\n\x3c!--\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(8,t,0),inverse:n.noop,data:t}))?i:"")+"  --\x3e\n\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(10,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(12,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(14,t,0),inverse:n.noop,data:t}))?i:"")+"\n\x3c!--\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(16,t,0),inverse:n.noop,data:t}))?i:"")+"--\x3e\n\n\x3c!--\n"+(null!=(i=(a.ifCond||l&&l.ifCond||d).call(o,null!=l?l.isMe:l,"&&",null!=l?l.isExtension:l,{name:"ifCond",hash:{},fn:n.program(18,t,0),inverse:n.noop,data:t}))?i:"")+"--\x3e\n\n"+(null!=(i=a.unless.call(o,null!=l?l.isMe:l,{name:"unless",hash:{},fn:n.program(20,t,0),inverse:n.noop,data:t}))?i:"")+"\n\x3c!--\n\n  <li>\n    <div class='pt-menu-hide', data-role='hide-pt', data-room='"+r(u(null!=(i=null!=(i=null!=l?l.data:l)?i.room:i)?i._id:i,l))+"', style='display:inline'>Hide "+r(u(null!=(i=null!=l?l.data:l)?i.name:i,l))+"</div>\n\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(22,t,0),inverse:n.noop,data:t}))?i:"")+"\n  </li>\n--\x3e\n\n\x3c!--\n\n"+(null!=(i=a.if.call(o,null!=l?l.isMe:l,{name:"if",hash:{},fn:n.program(24,t,0),inverse:n.noop,data:t}))?i:"")+"--\x3e\n\n</ul>"},useData:!0}),this.Templates.extension.addNotification=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i,s,u=null!=l?l:{},r=a.helperMissing,o=n.escapeExpression;return'<div class="pt-notify-bubble">\n\t<a href="#!" data-role="room" data-id='+o((s=null!=(s=a._id||(null!=l?l._id:l))?s:r,"function"==typeof s?s.call(u,{name:"_id",hash:{},data:t}):s))+' data-room="'+o((s=null!=(s=a.room||(null!=l?l.room:l))?s:r,"function"==typeof s?s.call(u,{name:"room",hash:{},data:t}):s))+'" >'+o(n.lambda(null!=(i=null!=l?l.post:l)?i.title:i,l))+"</a>\n</div>"},useData:!0}),this.Templates.extension.addRoom=Handlebars.template({1:function(n,l,a,e,t){var i,s=null!=l?l:{},u=a.helperMissing;return(null!=(i=(a.ifCond||l&&l.ifCond||u).call(s,null!=(i=null!=l?l.livePost:l)?i.type:i,"===","soundcloud",{name:"ifCond",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=(a.ifCond||l&&l.ifCond||u).call(s,null!=(i=null!=l?l.livePost:l)?i.type:i,"===","youtube",{name:"ifCond",hash:{},fn:n.program(4,t,0),inverse:n.noop,data:t}))?i:"")+"    \n"},2:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return'\n      <div id="pt-iframe-container"><iframe id="pt-content" frameborder="0" data-id=\''+u(s(null!=(i=null!=l?l.livePost:l)?i._id:i,l))+"'  data-title='"+u(s(null!=(i=null!=l?l.livePost:l)?i.title:i,l))+"' src=\"https://w.soundcloud.com/player/?url="+u(s(null!=(i=null!=l?l.livePost:l)?i.url:i,l))+'&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=true"></iframe></div>\n\n'},4:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return'\n      <div id="pt-iframe-container"><iframe id="pt-content" frameborder="0" data-id=\''+u(s(null!=(i=null!=l?l.livePost:l)?i._id:i,l))+"'  data-title='"+u(s(null!=(i=null!=l?l.livePost:l)?i.title:i,l))+"' src='"+u(s(null!=(i=null!=l?l.livePost:l)?i.url:i,l))+"'></iframe></div>\n\n"},6:function(n,l,a,e,t){return'      <div id="pt-iframe-container"><iframe id="pt-content" frameborder="0" data-id=""  data-title="" src=""></iframe></div>\n\n'},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i,s,u=null!=l?l:{},r=a.helperMissing,o="function",d=n.escapeExpression;return'\n\n<div class="pt-room-header"  data-name=\''+d((s=null!=(s=a.title||(null!=l?l.title:l))?s:r,typeof s===o?s.call(u,{name:"title",hash:{},data:t}):s))+"' data-id='"+d((s=null!=(s=a._id||(null!=l?l._id:l))?s:r,typeof s===o?s.call(u,{name:"_id",hash:{},data:t}):s))+"' data-user='"+d((s=null!=(s=a.user||(null!=l?l.user:l))?s:r,typeof s===o?s.call(u,{name:"user",hash:{},data:t}):s))+'\'>\n  <div class="row">\n    <div class="pt-room-users col-xs-4">'+d((s=null!=(s=a.viewers||(null!=l?l.viewers:l))?s:r,typeof s===o?s.call(u,{name:"viewers",hash:{},data:t}):s))+'</div>\n    <div class="pt-room-title col-xs-4">'+d((s=null!=(s=a.title||(null!=l?l.title:l))?s:r,typeof s===o?s.call(u,{name:"title",hash:{},data:t}):s))+'</div>\n\n    <div class="pt-minimize-close col-xs-4">\n\n      <span id="pt-search-room"  data-id=\''+d((s=null!=(s=a._id||(null!=l?l._id:l))?s:r,typeof s===o?s.call(u,{name:"_id",hash:{},data:t}):s))+"' data-user='"+d((s=null!=(s=a.user||(null!=l?l.user:l))?s:r,typeof s===o?s.call(u,{name:"user",hash:{},data:t}):s))+'\' >\n        <img src="/icons/core/search-white.svg"/>\n      </span>\n      <span id="pt-minimize-room"  data-id=\''+d((s=null!=(s=a._id||(null!=l?l._id:l))?s:r,typeof s===o?s.call(u,{name:"_id",hash:{},data:t}):s))+"' data-is-minimized=false data-user='"+d((s=null!=(s=a.user||(null!=l?l.user:l))?s:r,typeof s===o?s.call(u,{name:"user",hash:{},data:t}):s))+'\' >\n        <img src="/icons/core/minus-white.svg"/>\n      </span>\n      <span id="pt-close-room"  data-id=\''+d((s=null!=(s=a._id||(null!=l?l._id:l))?s:r,typeof s===o?s.call(u,{name:"_id",hash:{},data:t}):s))+"' data-user='"+d((s=null!=(s=a.user||(null!=l?l.user:l))?s:r,typeof s===o?s.call(u,{name:"user",hash:{},data:t}):s))+'\' >\n        <img src="/icons/core/x-white.svg"/>\n      </span>\n    </div>\n  </div>\n</div>\n<div class="pt-room-body">\n  \n'+(null!=(i=a.if.call(u,null!=l?l.livePost:l,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=a.unless.call(u,null!=l?l.livePost:l,{name:"unless",hash:{},fn:n.program(6,t,0),inverse:n.noop,data:t}))?i:"")+'\n  <div id="pt-messages-container">\n    <ul class="list-unstyled"></ul>\n  </div>\n\n  <div id="pt-search-results-container">\n  </div>\n\n  <div id="pt-form-container">\n    <form class="form-inline" id="pt-room-form">\n      <div class="form-group">\n        <div class="input-group"><input class="form-control" type="text" data-role="chat" id="pt-room-input" autocomplete="off" placeholder="Send a message..." />\n          <div class="input-group-addon"><button class="btn btn-custom-room" type="submit"><span>Send</span></button></div>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n'},useData:!0}),this.Templates.extension.addSearchResults=Handlebars.template({1:function(n,l,a,e,t){var i,s=n.lambda,u=n.escapeExpression;return'\t\t<li data-contentid="'+u(s(null!=(i=null!=l?l.id:l)?i.videoId:i,l))+'" data-type="youtube" data-title="'+u(s(null!=(i=null!=l?l.snippet:l)?i.title:i,l))+'" data-url=https://www.youtube.com/embed/'+u(s(null!=(i=null!=l?l.id:l)?i.videoId:i,l))+'>\n\t\t\t<div  class="row no-margin">\n\t\t\t\t<div class="col-xs-5 no-padding">\n\t\t\t\t\t<img class="pt-result-icon" src="/icons/logos/yt-icon.png"></img>\n\t\t\t\t\t<img class="pt-result-thumbnail" src="'+u(s(null!=(i=null!=(i=null!=(i=null!=l?l.snippet:l)?i.thumbnails:i)?i.default:i)?i.url:i,l))+'"></img>\n\t\t\t\t</div>\n\t\t\t\t<div class="col-xs-7 no-padding pt-result-title">'+u((a.truncateTitle||l&&l.truncateTitle||a.helperMissing).call(null!=l?l:{},null!=(i=null!=l?l.snippet:l)?i.title:i,{name:"truncateTitle",hash:{},data:t}))+"</div>\n\t\t\t</div>\n\t\t</li>\n"},3:function(n,l,a,e,t){var i,s,u=null!=l?l:{},r=a.helperMissing,o=n.escapeExpression;return'\t\t<li data-contentid="'+o((s=null!=(s=a.id||(null!=l?l.id:l))?s:r,"function"==typeof s?s.call(u,{name:"id",hash:{},data:t}):s))+'" data-type="soundcloud" data-title="'+o((s=null!=(s=a.title||(null!=l?l.title:l))?s:r,"function"==typeof s?s.call(u,{name:"title",hash:{},data:t}):s))+'" data-url="'+o((s=null!=(s=a.uri||(null!=l?l.uri:l))?s:r,"function"==typeof s?s.call(u,{name:"uri",hash:{},data:t}):s))+'">\n\t\t\t<div  class="row no-margin">\n\t\t\t\t<div class="col-xs-5 no-padding">\n\t\t\t\t\t<img class="pt-result-icon" src="/icons/logos/sc-icon.png"></img>\n'+(null!=(i=a.if.call(u,null!=l?l.artwork_url:l,{name:"if",hash:{},fn:n.program(4,t,0),inverse:n.noop,data:t}))?i:"")+(null!=(i=a.unless.call(u,null!=l?l.artwork_url:l,{name:"unless",hash:{},fn:n.program(6,t,0),inverse:n.noop,data:t}))?i:"")+'\t\t\t\t</div>\n\t\t\t\t<div class="col-xs-7 no-padding pt-result-title">'+o((a.truncateTitle||l&&l.truncateTitle||r).call(u,null!=l?l.title:l,{name:"truncateTitle",hash:{},data:t}))+"</div>\n\t\t\t</div>\n\t\t</li>\n"},4:function(n,l,a,e,t){var i;return'\t\t\t\t\t\t<img class="pt-result-thumbnail" src="'+n.escapeExpression((i=null!=(i=a.artwork_url||(null!=l?l.artwork_url:l))?i:a.helperMissing,"function"==typeof i?i.call(null!=l?l:{},{name:"artwork_url",hash:{},data:t}):i))+'"></img>\n'},6:function(n,l,a,e,t){var i;return'\t\t\t\t\t\t<img class="pt-result-thumbnail" src="'+n.escapeExpression(n.lambda(null!=(i=null!=l?l.user:l)?i.avatar_url:i,l))+'"></img>\n'},compiler:[7,">= 4.0.0"],main:function(n,l,a,e,t){var i,s=null!=l?l:{};return'<div id="pt-close-search-results">\n\t<span>\n\t      <img src="/icons/core/x.svg"/>\n\t</span>\n</div>\n\n<ul class="list-unstyled">\n\n'+(null!=(i=a.each.call(s,null!=l?l.ytResults:l,{name:"each",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=a.each.call(s,null!=l?l.scResults:l,{name:"each",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?i:"")+"\n\n</ul>"},useData:!0});