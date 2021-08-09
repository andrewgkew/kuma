(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["dataplanes~dataplanes-gateway~dataplanes-standard"],{"63b5":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("KCard",{attrs:{"border-variant":"noBorder"}},[a("template",{slot:"body"},[a("ul",t._l(t.warnings,(function(e){var n=e.kind,s=e.payload,r=e.index;return a("li",{key:n+"/"+r,staticClass:"mb-1"},[a("KAlert",{attrs:{appearance:"warning"}},[a("template",{slot:"alertMessage"},[a(t.getWarningComponent(n),{tag:"component",attrs:{payload:s}})],1)],2)],1)})),0)])],2)},s=[],r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t._v(" "+t._s(t.payload)+" ")])},i=[],o={name:"WarningDefault",props:{payload:{type:[String,Object],required:!0}}},l=o,u=a("2877"),c=Object(u["a"])(l,r,i,!1,null,null,null),p=c.exports,d=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t._v(" Envoy ("),a("strong",[t._v(t._s(t.payload.envoy))]),t._v(") is unsupported by the current version of Kuma DP ("),a("strong",[t._v(t._s(t.payload.kumaDp))]),t._v(") [Requirements: "),a("strong",[t._v(" "+t._s(t.payload.requirements))]),t._v("] ")])},m=[],v={name:"WarningEnvoyIncompatible",props:{payload:{type:Object,required:!0}}},y=v,b=Object(u["a"])(y,d,m,!1,null,null,null),h=b.exports,g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t._v(" There is mismatch between versions of Kuma DP ("),a("strong",[t._v(t._s(t.payload.kumaDpVersion))]),t._v(") and the Zone CP ("),a("strong",[t._v(t._s(t.payload.zoneVersion))]),t._v(") ")])},f=[],_={name:"WarningZoneAndKumaDPVersionsIncompatible",props:{payload:{type:Object,required:!0}}},k=_,w=Object(u["a"])(k,g,f,!1,null,null,null),x=w.exports,O=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t._v(" Unsupported version of Kuma DP ("),a("strong",[t._v(t._s(t.payload.kumaDpVersion))]),t._v(") ")])},E=[],D={name:"WarningUnsupportedKumaDPVersion",props:{payload:{type:Object,required:!0}}},j=D,T=Object(u["a"])(j,O,E,!1,null,null,null),C=T.exports,V=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[t._v(" There is mismatch between versions of Zone CP ("),a("strong",[t._v(t._s(t.payload.zoneCpVersion))]),t._v(") and the Global CP ("),a("strong",[t._v(t._s(t.payload.globalCpVersion))]),t._v(") ")])},L=[],S={name:"WarningZoneAndGlobalCPSVersionsIncompatible",props:{payload:{type:Object,required:!0}}},U=S,I=Object(u["a"])(U,V,L,!1,null,null,null),P=I.exports,$=a("dbf3"),R={name:"Warnings",props:{warnings:{type:Array,required:!0}},methods:{getWarningComponent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";switch(t){case $["b"]:return h;case $["c"]:return C;case $["f"]:return x;case $["e"]:return P;default:return p}}}},A=R,K=Object(u["a"])(A,n,s,!1,null,null,null);e["a"]=K.exports},6663:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"entity-url-control"},[t.shouldDisplay?a("KClipboardProvider",{scopedSlots:t._u([{key:"default",fn:function(e){var n=e.copyToClipboard;return[a("KPop",{attrs:{placement:"bottom"}},[a("KButton",{attrs:{appearance:"secondary",size:"small"},on:{click:function(){n(t.url)}}},[a("KIcon",{attrs:{slot:"icon",icon:"externalLink"},slot:"icon"}),t._v(" "+t._s(t.copyButtonText)+" ")],1),a("div",{attrs:{slot:"content"},slot:"content"},[a("p",[t._v(t._s(t.confirmationText))])])],1)]}}],null,!1,1603401634)}):t._e()],1)},s=[],r=a("a026"),i=r["default"].extend({name:"EntityURLControl",props:{url:{type:String,required:!0},copyButtonText:{type:String,default:"Copy URL"},confirmationText:{type:String,default:"URL copied to clipboard!"}},computed:{shouldDisplay:function(){var t=this.$route.params.mesh||null;return!(!t||"all"===t)}}}),o=i,l=a("2877"),u=Object(l["a"])(o,n,s,!1,null,null,null);e["a"]=u.exports},8344:function(t,e,a){"use strict";a("9907")},"85e6":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("FrameSkeleton",[a("DataOverview",{attrs:{"page-size":t.pageSize,"has-error":t.hasError,"is-loading":t.isLoading,"empty-state":t.getEmptyState(),"display-data-table":!0,"table-data":t.buildTableData(),"table-data-is-empty":t.tableDataIsEmpty,"show-warnings":t.tableData.data.some((function(t){return t.withWarnings})),"table-data-function-text":"View","table-data-row":"name"},on:{tableAction:t.tableAction,reloadData:t.loadData}},[a("template",{slot:"additionalControls"},[a("KButton",{staticClass:"add-dp-button",attrs:{appearance:"primary",size:"small",to:t.dataplaneWizardRoute},nativeOn:{click:function(e){return t.onCreateClick(e)}}},[a("span",{staticClass:"custom-control-icon"},[t._v(" + ")]),t._v(" Create data plane proxy ")]),this.$route.query.ns?a("KButton",{staticClass:"back-button",attrs:{appearance:"primary",size:"small",to:t.nsBackButtonRoute}},[a("span",{staticClass:"custom-control-icon"},[t._v(" ← ")]),t._v(" View All ")]):t._e()],1),a("template",{slot:"pagination"},[a("Pagination",{attrs:{"has-previous":t.previous.length>0,"has-next":t.hasNext},on:{next:t.goToNextPage,previous:t.goToPreviousPage}})],1)],2),!1===t.isEmpty?a("Tabs",{attrs:{"has-error":t.hasError,"is-loading":t.isLoading,tabs:t.filterTabs(),"initial-tab-override":"overview"}},[a("template",{slot:"tabHeader"},[a("div",[a("h3",[t._v(t._s(t.tabGroupTitle))])]),a("div",[a("EntityURLControl",{attrs:{url:t.shareUrl}})],1)]),a("template",{slot:"overview"},[a("LabelList",{attrs:{"has-error":t.entityHasError,"is-loading":t.entityIsLoading,"is-empty":t.entityIsEmpty}},[a("div",[a("ul",t._l(t.entity.basicData,(function(e,n){return a("li",{key:n},[a("div","status"===n?[a("h4",[t._v(t._s(n))]),a("div",{staticClass:"entity-status",class:{"is-offline":"offline"===e.status.toString().toLowerCase()||!1===e.status,"is-degraded":"partially degraded"===e.status.toString().toLowerCase()||!1===e.status}},[a("span",{staticClass:"entity-status__label"},[t._v(t._s(e.status))])]),a("div",{staticClass:"reason-list"},[a("ul",t._l(e.reason,(function(e){return a("li",{key:e},[a("span",{staticClass:"entity-status__dot"}),t._v(" "+t._s(e)+" ")])})),0)])]:[a("h4",[t._v(t._s(n))]),t._v(" "+t._s(e)+" ")])])})),0)]),a("div",[a("h4",[t._v("Tags")]),a("p",t._l(t.entity.tags,(function(e,n){return a("span",{key:n,staticClass:"tag-cols"},[a("span",[t._v(" "+t._s(e.label)+": ")]),a("span",[t._v(" "+t._s(e.value)+" ")])])})),0)])])],1),t.showMtls?a("template",{slot:"mtls"},[a("LabelList",{attrs:{"has-error":t.entityHasError,"is-loading":t.entityIsLoading,"is-empty":t.entityIsEmpty}},[t.entity.mtls?a("ul",t._l(t.entity.mtls,(function(e,n){return a("li",{key:n},[a("h4",[t._v(t._s(e.label))]),a("p",[t._v(" "+t._s(e.value)+" ")])])})),0):a("KAlert",{attrs:{appearance:"danger"}},[a("template",{slot:"alertMessage"},[t._v(" This data plane proxy does not yet have mTLS configured — "),a("a",{staticClass:"external-link",attrs:{href:"https://kuma.io/docs/"+t.version+"/documentation/security/#certificates",target:"_blank"}},[t._v(" Learn About Certificates in "+t._s(t.$productName)+" ")])])],2)],1)],1):t._e(),a("template",{slot:"yaml"},[a("YamlView",{attrs:{title:t.entityOverviewTitle,"has-error":t.entityHasError,"is-loading":t.entityIsLoading,"is-empty":t.entityIsEmpty,content:t.rawEntity}})],1),a("template",{slot:"warnings"},[a("Warnings",{attrs:{warnings:t.warnings}})],1)],2):t._e()],1)},s=[],r=(a("99af"),a("4de4"),a("7db0"),a("d81d"),a("13d5"),a("b0c0"),a("d3b7"),a("3ca3"),a("ddb0"),a("96cf"),a("c964")),i=a("f3f3"),o=a("2f62"),l=a("027b"),u=a("bc1e"),c=a("dbf3"),p=a("6663"),d=a("b912"),m=a("1d10"),v=a("1799"),y=a("2778"),b=a("251b"),h=a("ff9d"),g=a("0ada"),f=a("63b5"),_="kuma.io/zone",k={name:"Dataplanes",components:{Warnings:f["a"],EntityURLControl:p["a"],FrameSkeleton:m["a"],Pagination:v["a"],DataOverview:y["a"],Tabs:b["a"],YamlView:h["a"],LabelList:g["a"]},mixins:[d["a"]],props:{nsBackButtonRoute:{type:Object,default:function(){return{name:"dataplanes"}}},emptyStateMsg:{type:String,default:"There are no data plane proxies present."},dataplaneApiParams:{type:Object,default:function(){return{}}},tableHeaders:{type:Array,default:function(){return[{key:"actions",hideLabel:!0},{label:"Status",key:"status"},{label:"Name",key:"name"},{label:"Mesh",key:"mesh"},{label:"Type",key:"type"},{label:"Tags",key:"tags"},{label:"Last Connected",key:"lastConnected"},{label:"Last Updated",key:"lastUpdated"},{label:"Total Updates",key:"totalUpdates"},{label:"Kuma DP version",key:"dpVersion"},{label:"Envoy version",key:"envoyVersion"},{key:"warnings",hideLabel:!0}]}},tabs:{type:Array,default:function(){return[{hash:"#overview",title:"Overview"},{hash:"#mtls",title:"Certificate Insights"},{hash:"#yaml",title:"YAML"},{hash:"#warnings",title:"Warnings"}]}},showMtls:{type:Boolean,default:!0}},data:function(){return{isLoading:!0,isEmpty:!1,hasError:!1,entityIsLoading:!0,entityIsEmpty:!1,entityHasError:!1,warnings:[],tableDataIsEmpty:!1,tableData:{headers:[],data:[]},entity:[],rawEntity:null,firstEntity:null,pageSize:this.$pageSize,pageOffset:null,next:null,hasNext:!1,previous:[],tabGroupTitle:null,entityNamespace:null,entityOverviewTitle:null,shownTLSTab:!1}},computed:Object(i["a"])(Object(i["a"])({},Object(o["c"])({environment:"config/getEnvironment",queryNamespace:"getItemQueryNamespace",supportedVersions:"getSupportedVersions",supportedVersionsLoading:"getSupportedVersionsFetching",multicluster:"config/getMulticlusterStatus"})),{},{dataplaneWizardRoute:function(){return"universal"===this.environment?{name:"universal-dataplane"}:{name:"kubernetes-dataplane"}},version:function(){var t=this.$store.getters.getVersion;return null!==t?t:"latest"},shareUrl:function(){var t=this,e="".concat(window.location.origin,"/#"),a=this.entity,n=function(){return a.basicData?t.$route.query.ns?t.$route.fullPath:"".concat(e).concat(t.$route.fullPath,"?ns=").concat(a.basicData.name):null};return n()}}),watch:{$route:function(){this.loadData()}},beforeMount:function(){this.fetchSupportedVersions(),this.loadData()},methods:Object(i["a"])(Object(i["a"])({},Object(o["b"])(["fetchSupportedVersions"])),{},{onCreateClick:function(){l["a"].logger.info("create-data-proxy-plane-clicked")},buildEntity:function(t,e,a){var n=a.mTLS?Object(c["o"])(a.mTLS):null;return{basicData:t,tags:e,mtls:n}},init:function(){this.loadData()},getEmptyState:function(){return{title:"No Data",message:this.emptyStateMsg}},filterTabs:function(){return this.warnings.length?this.tabs:this.tabs.filter((function(t){return"#warnings"!==t.hash}))},buildTableData:function(){return Object(i["a"])(Object(i["a"])({},this.tableData),{},{headers:this.tableHeaders})},checkVersionsCompatibility:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object(c["h"])(this.supportedVersions,t,e)},goToPreviousPage:function(){this.pageOffset=this.previous.pop(),this.next=null,this.loadData()},goToNextPage:function(){this.previous.push(this.pageOffset),this.pageOffset=this.next,this.next=null,this.loadData()},tableAction:function(t){var e=t;this.getEntity(e)},loadData:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var a,n,s,o,l,p,d,m,v,y,b;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.isLoading=!0,a=t.$route.params.mesh||null,n=t.$route.query.ns||null,s=Object(i["a"])({size:t.pageSize,offset:t.pageOffset},t.dataplaneApiParams),o=function(){return"all"===a?t.$api.getAllDataplaneOverviews(s):n&&n.length&&"all"!==a?t.$api.getDataplaneOverviewFromMesh(a,n):t.$api.getAllDataplaneOverviewsFromMesh(a,s)},l=function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(a,n,s){var r,i,o,l,p,d,m,v,y,b,h,g,f,k,w,x,O,E,D,j,T,C,V,L,S,U,I,P,$,R;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.$api.getDataplaneOverviewFromMesh(a,n);case 3:r=e.sent,i=r.dataplane,o=void 0===i?{}:i,l=r.dataplaneInsight,p=void 0===l?{}:l,d=r.name,m=void 0===d?"":d,v=r.mesh,y=void 0===v?"":v,b=p.subscriptions,h=void 0===b?[]:b,g=Object(c["i"])(o),f=Object(c["m"])(o,p),k=f.status,w={totalUpdates:0,totalRejectedUpdates:0,dpVersion:"-",envoyVersion:"-",selectedTime:NaN,selectedUpdateTime:NaN},x=h.reduce((function(t,e){var a=e.status,n=void 0===a?{}:a,s=e.connectTime,r=e.version,i=void 0===r?{}:r,o=n.total,l=void 0===o?{}:o,u=n.lastUpdateTime,c=l.responsesSent,p=void 0===c?"0":c,d=l.responsesRejected,m=void 0===d?"0":d,v=i.kumaDp,y=void 0===v?{}:v,b=i.envoy,h=void 0===b?{}:b,g=y.version,f=h.version,_=t.selectedTime,k=t.selectedUpdateTime,w=Date.parse(s),x=Date.parse(u);return w&&(!_||w>_)&&(_=w),x&&(!k||x>k)&&(k=x),{totalUpdates:t.totalUpdates+parseInt(p,10),totalRejectedUpdates:t.totalRejectedUpdates+parseInt(m,10),dpVersion:g||t.dpVersion,envoyVersion:f||t.envoyVersion,selectedTime:_,selectedUpdateTime:k}}),w),O=x.totalUpdates,E=x.totalRejectedUpdates,D=x.dpVersion,j=x.envoyVersion,T=x.selectedTime,C=x.selectedUpdateTime,V=T?Object(u["g"])(new Date(T).toUTCString()):"never",L=C?Object(u["g"])(new Date(C).toUTCString()):"never",S={name:m,mesh:y,tags:g,status:k,lastConnected:V,lastUpdated:L,totalUpdates:O,totalRejectedUpdates:E,dpVersion:D,envoyVersion:j,withWarnings:!1,unsupportedEnvoyVersion:!1,unsupportedKumaDPVersion:!1,kumaDpAndKumaCpMismatch:!1,type:Object(c["l"])(o)},U=t.checkVersionsCompatibility(D,j),I=U.kind,e.t0=I,e.next=e.t0===c["b"]?19:e.t0===c["c"]?22:25;break;case 19:return S.unsupportedEnvoyVersion=!0,S.withWarnings=!0,e.abrupt("break",25);case 22:return S.unsupportedKumaDPVersion=!0,S.withWarnings=!0,e.abrupt("break",25);case 25:if(!t.multicluster){e.next=39;break}if(P=g.find((function(t){return t.label===_})),!P){e.next=39;break}return e.prev=28,e.next=31,Object(c["g"])(t.$api,P.value,D);case 31:$=e.sent,R=$.compatible,R||(S.withWarnings=!0,S.kumaDpAndKumaCpMismatch=!0),e.next=39;break;case 36:e.prev=36,e.t1=e["catch"](28),console.error(e.t1);case 39:return s.push(S),t.sortEntities(s),e.abrupt("return",s);case 44:e.prev=44,e.t2=e["catch"](0),console.error(e.t2);case 47:case"end":return e.stop()}}),e,null,[[0,44],[28,36]])})));return function(t,a,n){return e.apply(this,arguments)}}(),e.prev=6,e.next=9,o();case 9:if(p=e.sent,d=function(){var e=p;return"total"in e?0!==e.total&&e.items&&e.items.length>0?t.sortEntities(e.items):null:e},m=d(),!m){e.next=32;break}return p.next?(t.next=Object(u["e"])(p.next),t.hasNext=!0):t.hasNext=!1,v=[],y=n?m:m[0],t.firstEntity=y.name,e.next=19,t.getEntity(y);case 19:if(!(n&&n.length&&a&&a.length)){e.next=24;break}return e.next=22,l(a,n,v);case 22:e.next=27;break;case 24:return b=m.map((function(t){return l(t.mesh,t.name,v)})),e.next=27,Promise.all(b);case 27:t.tableData.data=v,t.tableDataIsEmpty=!1,t.isEmpty=!1,e.next=37;break;case 32:return t.tableData.data=[],t.tableDataIsEmpty=!0,t.isEmpty=!0,e.next=37,t.getEntity(null);case 37:e.next=44;break;case 39:e.prev=39,e.t0=e["catch"](6),t.hasError=!0,t.isEmpty=!0,console.error(e.t0);case 44:setTimeout((function(){t.isLoading=!1}),"500");case 45:case"end":return e.stop()}}),e,null,[[6,39]])})))()},getEntity:function(t){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var n,s,r,o,l,p,d,m,v,y,b,h,g,f,k,w,x,O,E,D,j,T,C,V;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.entityIsLoading=!0,e.entityIsEmpty=!1,e.entityHasError=!1,n=e.$route.params.mesh,!t){a.next=56;break}return s="all"===n?t.mesh:n,a.prev=6,a.next=9,e.$api.getDataplaneOverviewFromMesh(s,t.name);case 9:if(r=a.sent,o=Object(c["j"])(r),!o){a.next=45;break}if(l=["type","name","mesh"],p=Object(c["k"])(r)||{},d=Object(c["m"])(o,p),m=Object(c["i"])(o),v=Object(i["a"])(Object(i["a"])({},Object(u["f"])(o,l)),{},{status:d}),e.entity=e.buildEntity(v,m,p),e.entityNamespace=v.name,e.tabGroupTitle="Mesh: ".concat(v.name),e.entityOverviewTitle="Entity Overview for ".concat(v.name),e.warnings=[],y=p.subscriptions,b=void 0===y?[]:y,!b.length){a.next=42;break}if(h=b.pop(),g=h.version,f=void 0===g?{}:g,k=f.kumaDp,w=void 0===k?{}:k,x=f.envoy,O=void 0===x?{}:x,w&&O&&(E=e.checkVersionsCompatibility(w.version,O.version),D=E.kind,D!==c["a"]&&D!==c["d"]&&e.warnings.push(E)),!e.multicluster){a.next=42;break}if(j=m.find((function(t){return t.label===_})),!j){a.next=42;break}return a.prev=30,a.next=33,Object(c["g"])(e.$api,j.value,w.version);case 33:T=a.sent,C=T.compatible,V=T.payload,C||e.warnings.push({kind:c["f"],payload:V}),a.next=42;break;case 39:a.prev=39,a.t0=a["catch"](30),console.error(a.t0);case 42:e.rawEntity=Object(u["k"])(o),a.next=47;break;case 45:e.entity=null,e.entityIsEmpty=!0;case 47:a.next=53;break;case 49:a.prev=49,a.t1=a["catch"](6),e.entityHasError=!0,console.error(a.t1);case 53:setTimeout((function(){e.entityIsLoading=!1}),"500"),a.next=57;break;case 56:setTimeout((function(){e.entityIsEmpty=!0,e.entityIsLoading=!1}),"500");case 57:case"end":return a.stop()}}),a,null,[[6,49],[30,39]])})))()}})},w=k,x=(a("8344"),a("2877")),O=Object(x["a"])(w,n,s,!1,null,"431c0e72",null);e["a"]=O.exports},9907:function(t,e,a){}}]);