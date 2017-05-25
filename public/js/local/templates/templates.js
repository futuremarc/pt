this.Templates=this.Templates||{},this.Templates.auth=this.Templates.auth||{},this.Templates.auth.addFriendRequests=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n  <form id='pt-requests-form'>\n    \n    <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"    </ul>\n    \n  </form>\n\n"},2:function(n,a,l,e,t){var i,s=null!=a?a:{},u=l.helperMissing,r="function",d=n.escapeExpression;return"\n        <li data-id='"+d((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"'>\n        \n          <div>\n            "+d((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"\n          </div>\n\n          <ul class=\"list-inline\">\n            <li>\n              <input type='submit' data-action='accept', data-name='"+d((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+d((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Accept'>\n            </li>\n\n            <li>\n              <input type='submit' data-action='reject', data-name='"+d((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+d((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Reject'>\n            </li>\n          </ul>\n\n        </li>\n        <br/>\n\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"<h3>Friend Requests</h3>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")},useData:!0}),this.Templates.auth.addFriendsList=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n  <form id='pt-friends-form'>\n\n    <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"    </ul>\n    \n  </form>\n\n"},2:function(n,a,l,e,t){var i,s=n.lambda,u=n.escapeExpression;return"\n        <li data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"'>\n\n          <div>\n            "+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"\n          </div>\n          \n          <ul class=\"list-inline\">\n            <li>\n              <input type='submit' data-action='remove', data-name='"+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"', data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"', class='btn btn-custom friends-list-btn', value='Remove'>\n            </li>\n          </ul>\n\n        </li>\n        <br/>\n\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"<h3>Friends</h3>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")},useData:!0}),this.Templates.auth.addSubscriptions=Handlebars.template({1:function(n,a,l,e,t,i,s){var u;return"\n  <ul>\n"+(null!=(u=l.each.call(null!=a?a:{},null!=a?a.subscriptions:a,{name:"each",hash:{},fn:n.program(2,t,0,i,s),inverse:n.noop,data:t}))?u:"")+"  </ul>\n\n"},2:function(n,a,l,e,t,i,s){var u,r,d=null!=a?a:{},o=l.helperMissing,p=n.escapeExpression;return'\n      <li>\n\n        <div class="checkbox">\n          <label>\n            <input type="checkbox", data-id=\''+p((r=null!=(r=l._id||(null!=a?a._id:a))?r:o,"function"==typeof r?r.call(d,{name:"_id",hash:{},data:t}):r))+"', data-title=\""+p((r=null!=(r=l.title||(null!=a?a.title:a))?r:o,"function"==typeof r?r.call(d,{name:"title",hash:{},data:t}):r))+'", '+(null!=(u=l.if.call(d,null!=s[1]?s[1].mySubscriptions:s[1],{name:"if",hash:{},fn:n.program(3,t,0,i,s),inverse:n.noop,data:t}))?u:"")+' value="">\n            '+p((r=null!=(r=l.title||(null!=a?a.title:a))?r:o,"function"==typeof r?r.call(d,{name:"title",hash:{},data:t}):r))+"\n          </label>\n        </div>\n\n      </li>\n      \n"},3:function(n,a,l,e,t,i,s){var u;return" "+(null!=(u=(l.ifIn||a&&a.ifIn||l.helperMissing).call(null!=a?a:{},null!=a?a._id:a,null!=s[1]?s[1].mySubscriptions:s[1],{name:"ifIn",hash:{},fn:n.program(4,t,0,i,s),inverse:n.noop,data:t}))?u:"")+" "},4:function(n,a,l,e,t){return"checked"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,i,s){var u;return"<h4>What do you want to share with your friends?</h4>\n\n"+(null!=(u=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0,i,s),inverse:n.noop,data:t}))?u:"")},useData:!0,useDepths:!0}),this.Templates.extension=this.Templates.extension||{},this.Templates.extension.addMenu=Handlebars.template({1:function(n,a,l,e,t){return"      <li>\n        <div class='pt-menu-share' data-purpose='share'>share this page</div>\n      </li>\n"},3:function(n,a,l,e,t){var i;return"\t\t  <li class='pt-menu-home'>\n\t\t    <div data-purpose='home'>friend requests</div>\n"+(null!=(i=(l.ifCond||a&&a.ifCond||l.helperMissing).call(null!=a?a:{},null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,">",0,{name:"ifCond",hash:{},fn:n.program(4,t,0),inverse:n.program(6,t,0),data:t}))?i:"")+"\t\t  </li>\n"},4:function(n,a,l,e,t){var i;return"          <span class='pt-notification-counter' style='display:block'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,a))+"</span>\n"},6:function(n,a,l,e,t){var i;return"           <span class='pt-notification-counter'>"+n.escapeExpression(n.lambda(null!=(i=null!=(i=null!=a?a.data:a)?i.friendRequests:i)?i.length:i,a))+"</span>\n"},8:function(n,a,l,e,t){return"  \t\t<li class='pt-menu-friend' >\n    \t\t<div data-purpose='friend'>add friend</div>\n  \t\t</li>\n"},10:function(n,a,l,e,t){return"  \t<li class='pt-menu-home'>\n    \t<div data-purpose='settings'>settings</div>\n  \t</li>\n"},12:function(n,a,l,e,t){return"  \t<li class='pt-menu-hide-pt'>\n    \t<div data-purpose='hide-pt'>hide pt</div>\n  \t</li>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i,s,u=n.lambda,r=n.escapeExpression,d=null!=a?a:{};return"<ul data-id='"+r(u(null!=(i=null!=a?a.data:a)?i._id:i,a))+"'  data-name='"+r(u(null!=(i=null!=a?a.data:a)?i.name:i,a))+"' data-is-me='"+r((s=null!=(s=l.isMe||(null!=a?a.isMe:a))?s:l.helperMissing,"function"==typeof s?s.call(d,{name:"isMe",hash:{},data:t}):s))+"'>\n\n\x3c!--\n"+(null!=(i=l.if.call(d,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n--\x3e\n\n"+(null!=(i=l.if.call(d,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(d,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(8,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(d,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(10,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(d,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(12,t,0),inverse:n.noop,data:t}))?i:"")+"</ul>"},useData:!0});