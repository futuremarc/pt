this.Templates=this.Templates||{},this.Templates.extension=this.Templates.extension||{},this.Templates.extension.addMenu=Handlebars.template({1:function(n,a,l,e,t){return"      <li class='pt-menu-party' >\n        <div data-role='friend'>New party window</div>\n      </li>\n"},3:function(n,a,l,e,t){var i;return"\t\t  <li class='pt-menu-home pt-menu-item'>\n\t\t    <div data-role='home'>Friend requests</div>\n"+(null!=(i=(l.ifCond||a&&a.ifCond||l.helperMissing).call(null!=a?a:{},null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,">",0,{name:"ifCond",hash:{},fn:n.program(4,t,0),inverse:n.program(6,t,0),data:t}))?i:"")+"\t\t  </li>\n"},4:function(n,a,l,e,t){var i;return"          <span class='pt-notification-counter' style='display:block'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,a))+"</span>\n"},6:function(n,a,l,e,t){var i;return"           <span class='pt-notification-counter'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,a))+"</span>\n"},8:function(n,a,l,e,t){return"  \t\t<li class='pt-menu-friend pt-menu-item' >\n    \t\t<div data-role='friend'>Add friend</div>\n  \t\t</li>\n"},10:function(n,a,l,e,t){return"      <li>\n        <div class='pt-menu-share' data-role='share'>Share this page</div>\n      </li>\n"},12:function(n,a,l,e,t){return"      <li class='pt-menu-suggestions pt-menu-item'>\n        <div data-role='suggestions'>People you might know</div>\n      </li>\n"},14:function(n,a,l,e,t){return"    <li class='pt-menu-feedback pt-menu-item'>\n      <div data-role='feedback'>Bug report and feedback</div>\n    </li>\n"},16:function(n,a,l,e,t){return"    <li class='pt-menu-home pt-menu-item'>\n      <div data-role='settings'>Settings</div>\n    </li>\n"},18:function(n,a,l,e,t){return"    <li>\n      <div data-role='zoom-out' class='pt-menu-zoom' style='display:inline' >🔍 -</div> <span> / </span>\n      <div data-role='zoom-in' class='pt-menu-zoom' style='display:inline' >🔍 +</div>\n    </li>\n"},20:function(n,a,l,e,t){return"  \t<li class='pt-menu-hide-pt'>\n    \t<div data-role='hide-pt'>Hide pt</div>\n  \t</li>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i,s,u=n.lambda,r=n.escapeExpression,o=null!=a?a:{},d=l.helperMissing;return"<ul data-id='"+r(u(null!=(i=null!=a?a.data:a)?i._id:i,a))+"'  data-name='"+r(u(null!=(i=null!=a?a.data:a)?i.name:i,a))+"' data-is-me='"+r((s=null!=(s=l.isMe||(null!=a?a.isMe:a))?s:d,"function"==typeof s?s.call(o,{name:"isMe",hash:{},data:t}):s))+"'>\n\n\x3c!--\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n  --\x3e\n\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(8,t,0),inverse:n.noop,data:t}))?i:"")+"\n\n\x3c!--\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(10,t,0),inverse:n.noop,data:t}))?i:"")+"  --\x3e\n\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(12,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(14,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(16,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(18,t,0),inverse:n.noop,data:t}))?i:"")+"\n\n"+(null!=(i=(l.ifCond||a&&a.ifCond||d).call(o,null!=a?a.isMe:a,"&&",null!=a?a.isExtension:a,{name:"ifCond",hash:{},fn:n.program(20,t,0),inverse:n.noop,data:t}))?i:"")+"\n\n</ul>"},useData:!0}),this.Templates.auth=this.Templates.auth||{},this.Templates.auth.addFriendRequests=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n    <form id='pt-requests-form'>\n\n      <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,a,l,e,t){var i,s=null!=a?a:{},u=l.helperMissing,r="function",o=n.escapeExpression;return"\n          <li data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"'>\n          \n            <div>\n              "+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"\n            </div>\n\n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-role='request' data-action='accept', data-name='"+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Accept'>\n              </li>\n\n              <li>\n                <input type='submit' data-role='request' data-action='reject', data-name='"+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Reject'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,a,l,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"<h3>Friend Requests</h3>\n\n\n<div class='pt-auth-container'>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>\n"},useData:!0}),this.Templates.auth.addFriendsList=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n    <form id='pt-friends-form'>\n\n      <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,a,l,e,t){var i,s=n.lambda,u=n.escapeExpression;return"\n          <li data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"'>\n\n            <div>\n              "+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"\n            </div>\n            \n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-action='remove', data-role='request', data-name='"+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"', data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"', class='btn btn-custom friends-list-btn', value='Remove'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,a,l,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"\n<h3>Friends</h3>\n\n<div class='pt-auth-container'>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>"},useData:!0}),this.Templates.auth.addSubscriptions=Handlebars.template({1:function(n,a,l,e,t,i,s){var u;return"\n  <ul>\n"+(null!=(u=l.each.call(null!=a?a:{},null!=a?a.subscriptions:a,{name:"each",hash:{},fn:n.program(2,t,0,i,s),inverse:n.noop,data:t}))?u:"")+"  </ul>\n\n"},2:function(n,a,l,e,t,i,s){var u,r,o=null!=a?a:{},d=l.helperMissing,m=n.escapeExpression;return'\n      <li>\n\n        <div class="checkbox">\n\n          <label>\n            <input type="checkbox", data-id=\''+m((r=null!=(r=l._id||(null!=a?a._id:a))?r:d,"function"==typeof r?r.call(o,{name:"_id",hash:{},data:t}):r))+"', data-role='subscription', data-title=\""+m((r=null!=(r=l.title||(null!=a?a.title:a))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+'", '+(null!=(u=l.if.call(o,null!=s[1]?s[1].mySubscriptions:s[1],{name:"if",hash:{},fn:n.program(3,t,0,i,s),inverse:n.noop,data:t}))?u:"")+' value="">\n            '+m((r=null!=(r=l.title||(null!=a?a.title:a))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+"\n          </label>\n          \n        </div>\n\n      </li>\n      \n"},3:function(n,a,l,e,t,i,s){var u;return" "+(null!=(u=(l.ifIn||a&&a.ifIn||l.helperMissing).call(null!=a?a:{},null!=a?a._id:a,null!=s[1]?s[1].mySubscriptions:s[1],{name:"ifIn",hash:{},fn:n.program(4,t,0,i,s),inverse:n.noop,data:t}))?u:"")+" "},4:function(n,a,l,e,t){return"checked"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,i,s){var u;return"<h4>What do you want to share with your friends?</h4>\n\n"+(null!=(u=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0,i,s),inverse:n.noop,data:t}))?u:"")},useData:!0,useDepths:!0}),this.Templates.auth.addSuggestions=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n    <form id='pt-suggestions-form'>\n\n      <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"      </ul>\n      \n    </form>\n\n"},2:function(n,a,l,e,t){var i,s=null!=a?a:{},u=l.helperMissing,r=n.escapeExpression;return"\n          <li data-id='"+r((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,"function"==typeof i?i.call(s,{name:"_id",hash:{},data:t}):i))+"'>\n\n            <div>\n              "+r((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,"function"==typeof i?i.call(s,{name:"name",hash:{},data:t}):i))+"\n            </div>\n            \n            <ul class=\"list-inline\">\n              <li>\n                <input type='submit' data-action='request', data-role='friend', data-name='"+r((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,"function"==typeof i?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+r((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,"function"==typeof i?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Add'>\n              </li>\n            </ul>\n\n          </li>\n          <br/>\n\n"},4:function(n,a,l,e,t){return"    <span>None</span>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"\n<div class='pt-auth-container'>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.program(4,t,0),data:t}))?i:"")+"\n</div>"},useData:!0});