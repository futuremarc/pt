this.Templates=this.Templates||{},this.Templates.auth=this.Templates.auth||{},this.Templates.auth.addFriendRequests=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n  <form id='pt-requests-form'>\n    \n    <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"    </ul>\n    \n  </form>\n\n"},2:function(n,a,l,e,t){var i,s=null!=a?a:{},u=l.helperMissing,r="function",o=n.escapeExpression;return"\n        <li data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"'>\n        \n          <div>\n            "+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"\n          </div>\n\n          <ul class=\"list-inline\">\n            <li>\n              <input type='submit' data-action='accept', data-name='"+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Accept'>\n            </li>\n\n            <li>\n              <input type='submit' data-action='reject', data-name='"+o((i=null!=(i=l.name||(null!=a?a.name:a))?i:u,typeof i===r?i.call(s,{name:"name",hash:{},data:t}):i))+"', data-id='"+o((i=null!=(i=l._id||(null!=a?a._id:a))?i:u,typeof i===r?i.call(s,{name:"_id",hash:{},data:t}):i))+"', class='btn btn-custom friend-request-btn', value='Reject'>\n            </li>\n          </ul>\n\n        </li>\n        <br/>\n\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"<h3>Friend Requests</h3>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")},useData:!0}),this.Templates.auth.addFriendsList=Handlebars.template({1:function(n,a,l,e,t){var i;return"\n  <form id='pt-friends-form'>\n\n    <ul>\n"+(null!=(i=l.each.call(null!=a?a:{},a,{name:"each",hash:{},fn:n.program(2,t,0),inverse:n.noop,data:t}))?i:"")+"    </ul>\n    \n  </form>\n\n"},2:function(n,a,l,e,t){var i,s=n.lambda,u=n.escapeExpression;return"\n        <li data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"'>\n\n          <div>\n            "+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"\n          </div>\n          \n          <ul class=\"list-inline\">\n            <li>\n              <input type='submit' data-action='remove', data-name='"+u(s(null!=(i=null!=a?a.user:a)?i.name:i,a))+"', data-id='"+u(s(null!=(i=null!=a?a.user:a)?i._id:i,a))+"', class='btn btn-custom friends-list-btn', value='Remove'>\n            </li>\n          </ul>\n\n        </li>\n        <br/>\n\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i;return"<h3>Friends</h3>\n\n"+(null!=(i=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")},useData:!0}),this.Templates.auth.addSubscriptions=Handlebars.template({1:function(n,a,l,e,t,i,s){var u;return"\n  <ul>\n"+(null!=(u=l.each.call(null!=a?a:{},null!=a?a.subscriptions:a,{name:"each",hash:{},fn:n.program(2,t,0,i,s),inverse:n.noop,data:t}))?u:"")+"  </ul>\n\n"},2:function(n,a,l,e,t,i,s){var u,r,o=null!=a?a:{},d=l.helperMissing,p=n.escapeExpression;return'\n      <li>\n\n        <div class="checkbox">\n          <label>\n            <input type="checkbox", data-id=\''+p((r=null!=(r=l._id||(null!=a?a._id:a))?r:d,"function"==typeof r?r.call(o,{name:"_id",hash:{},data:t}):r))+"', data-title=\""+p((r=null!=(r=l.title||(null!=a?a.title:a))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+'", '+(null!=(u=l.if.call(o,null!=s[1]?s[1].mySubscriptions:s[1],{name:"if",hash:{},fn:n.program(3,t,0,i,s),inverse:n.noop,data:t}))?u:"")+' value="">\n            '+p((r=null!=(r=l.title||(null!=a?a.title:a))?r:d,"function"==typeof r?r.call(o,{name:"title",hash:{},data:t}):r))+"\n          </label>\n        </div>\n\n      </li>\n      \n"},3:function(n,a,l,e,t,i,s){var u;return" "+(null!=(u=(l.ifIn||a&&a.ifIn||l.helperMissing).call(null!=a?a:{},null!=a?a._id:a,null!=s[1]?s[1].mySubscriptions:s[1],{name:"ifIn",hash:{},fn:n.program(4,t,0,i,s),inverse:n.noop,data:t}))?u:"")+" "},4:function(n,a,l,e,t){return"checked"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t,i,s){var u;return"<h4>What do you want to share with your friends?</h4>\n\n"+(null!=(u=l.if.call(null!=a?a:{},a,{name:"if",hash:{},fn:n.program(1,t,0,i,s),inverse:n.noop,data:t}))?u:"")},useData:!0,useDepths:!0}),this.Templates.extension=this.Templates.extension||{},this.Templates.extension.addMenu=Handlebars.template({1:function(n,a,l,e,t){return"\t\t  <li>\n\t\t    <a href='#' class='pt-menu-home' data-purpose='home'>home</a>\n\t\t  </li>\n"},3:function(n,a,l,e,t){return"      <li>\n        <a href='#' class='pt-menu-signup' data-purpose='signup'>signup</a>\n      </li>\n"},5:function(n,a,l,e,t){return"      <li>\n        <a href='#' class='pt-menu-login' data-purpose='login'>login</a>\n      </li>\n"},7:function(n,a,l,e,t){return"  \t\t<li>\n    \t\t<a href='#' class='pt-menu-friend' data-purpose='friend'>add friend</a>\n  \t\t</li>\n"},9:function(n,a,l,e,t){return"  \t<li>\n    \t<a href='#' class='pt-menu-settings' data-purpose='settings'>settings</a>\n  \t</li>\n"},11:function(n,a,l,e,t){return"      <li>\n        <a href='#' class='pt-menu-logout' data-purpose='logout'>logout</a>\n      </li>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,t){var i,s,u=n.lambda,r=n.escapeExpression,o=null!=a?a:{};return"<ul data-id='"+r(u(null!=(i=null!=a?a.data:a)?i._id:i,a))+"'  data-name='"+r(u(null!=(i=null!=a?a.data:a)?i.name:i,a))+"' data-is-me='"+r((s=null!=(s=l.isMe||(null!=a?a.isMe:a))?s:l.helperMissing,"function"==typeof s?s.call(o,{name:"isMe",hash:{},data:t}):s))+"'>\n\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(1,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(3,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(5,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(7,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(9,t,0),inverse:n.noop,data:t}))?i:"")+"\n"+(null!=(i=l.if.call(o,null!=a?a.isMe:a,{name:"if",hash:{},fn:n.program(11,t,0),inverse:n.noop,data:t}))?i:"")+"\n  \t<li>\n    \t<a href='#' class='pt-menu-hide' data-purpose='hide'>hide</a>\n  \t</li>\n\n</ul>"},useData:!0});