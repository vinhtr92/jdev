(function(api){var MixinBase=api.MixinBase=React.createClass({displayName:'MixinBase',propTypes:{id:React.PropTypes.string,config:React.PropTypes.oneOfType([React.PropTypes.object,React.PropTypes.string]),fitHeight:React.PropTypes.string,textMapping:React.PropTypes.object},componentWillMount:function(){if(this.props.textMapping){api.Text.setData(this.props.textMapping,true,this);}if(this.props.config){if(typeof this.props.config=='string'){if(this.props.config!=''){api.Ajax.request(this.props.config,function(res){if(res.responseJSON){this.config=res.responseJSON;if(this.config.textMapping){api.Text.setData(this.config.textMapping,false,this);delete this.config.textMapping;}var state;for(var p in this.state){if(this.config.hasOwnProperty(p)){state=state||{};state[p]=this.config[p];}}if(state){this.setState(state);}else{try{this.forceUpdate();}catch(e){}}if(typeof this.configDidLoad=='function'){this.configDidLoad();}api.Event.trigger(this,'ConfigLoaded');}}.bind(this));}}else{this.config=JSON.parse(JSON.stringify(this.props.config));if(this.config.textMapping){api.Text.setData(this.config.textMapping,false,this);delete this.config.textMapping;}var state;for(var p in this.state){if(this.config.hasOwnProperty(p)){state=state||{};state[p]=this.config[p];}}if(state){this.setState(state);}}}},componentWillReceiveProps:function(newProps){if(this.state){var state;for(var p in newProps){if(!this.state.hasOwnProperty(p)&&!this.props.hasOwnProperty(p)){continue;}if(typeof newProps[p]=='object'){try{if(JSON.stringify(this.state[p])!=JSON.stringify(newProps[p])){state=state||{};state[p]=newProps[p];}}catch(e){if(this.state[p]!=newProps[p]){state=state||{};state[p]=newProps[p];}}}else if(this.state[p]!=newProps[p]){state=state||{};state[p]=newProps[p];}}if(state){this.setState(state);}}},render:function(){return null;},componentDidMount:function(){this.initActions();},componentDidUpdate:function(oldProps,oldState){this.initActions();},componentWillUnmount:function(){this.deinitActions();},initActions:function(){var id=this.state&&this.state.id?this.state.id:this.props.id;if(id!==undefined&&id!==null&&id!=''){var mountedNode=this.refs.mountedDOMNode||ReactDOM.findDOMNode(this);if(mountedNode&&(!mountedNode.id||mountedNode.id!=id)){mountedNode.id=id;}}if(this.config&&this.config.wrapperClass){api.Modal.setContainerClass(this.config.wrapperClass);api.ContextMenu.setContainerClass(this.config.wrapperClass);}if(this.props.fitHeight){this.calculateHeight();if(!this._listenedWindowResizeEvent){api.Event.add(window,'resize',this.calculateHeight);this._listenedWindowResizeEvent=true;}}},deinitActions:function(){if(this._listenedWindowResizeEvent){api.Event.remove(window,'resize',this.calculateHeight);delete this._listenedWindowResizeEvent;}},calculateHeight:function(){this.calculateHeightTimer&&clearTimeout(this.calculateHeightTimer);this.calculateHeightTimer=setTimeout(function(){var mountedNode=this.refs.mountedDOMNode||ReactDOM.findDOMNode(this);var fitHeightElms=mountedNode.querySelectorAll(this.props.fitHeight);var clientHeight=(document.documentElement||document.body).clientHeight;var container,containerTop,maxHeight,scrollHeight,debugPanel,debugPanelCss;for(var i=0;i<fitHeightElms.length;i++){container=fitHeightElms[i];containerTop=container.getBoundingClientRect().top;maxHeight=clientHeight-containerTop;container.style.height=maxHeight+'px';}for(var i=0;i<fitHeightElms.length;i++){scrollHeight=(document.documentElement||document.body).scrollHeight;if(scrollHeight>clientHeight){container=fitHeightElms[i];maxHeight=parseInt(container.style.height)-(scrollHeight-clientHeight);container.style.height=maxHeight+'px';}}if(debugPanel=document.getElementById('system-debug')){debugPanelCss=window.getComputedStyle(debugPanel);for(var i=0;i<fitHeightElms.length;i++){container=fitHeightElms[i];maxHeight=parseInt(container.style.height)+debugPanel.getBoundingClientRect().height;maxHeight+=parseInt(debugPanelCss.getPropertyValue('margin-top'));maxHeight+=parseInt(debugPanelCss.getPropertyValue('margin-bottom'));container.style.height=maxHeight+'px';}}}.bind(this),200);},executeAction:function(action,context,element,event,component){event&&event.preventDefault&&event.preventDefault();api.ContextMenu.get();api.ContextMenu.context=context;api.ContextMenu.element=element;api.ContextMenu.component=component||this;api.ContextMenu.doAction(action,event);},skipUpdate:function(type,res,event){return type=='prepare'?res:true;},scheduleRefresh:function(timer){setTimeout(function(){if(this.props.config){this.componentWillMount();}else{this.forceUpdate();}}.bind(this),timer||3000);}});var MixinInput=api.MixinInput=api.extendReactClass('MixinBase',{propTypes:{id:React.PropTypes.string,form:React.PropTypes.element,value:React.PropTypes.oneOfType([React.PropTypes.bool,React.PropTypes.array,React.PropTypes.object,React.PropTypes.number,React.PropTypes.string]),setting:React.PropTypes.string,control:React.PropTypes.object},getDefaultProps:function(){return{id:'',form:null,value:'',setting:'',control:{}};},getInitialState:function(){return{value:this.props.value};},componentWillMount:function(){this.parent();this.prepareControl();},componentWillUpdate:function(){this.prepareControl();},prepareControl:function(){this.label='';this.description='';if(this.props.control.label&&this.props.control.label!=''){this.label=api.Text.parse(this.props.control.label);}if(this.props.control.description&&this.props.control.description!=''){this.description=api.Text.parse(this.props.control.description);}this.tooltip='';if(this.props.control.hint&&this.props.control.hint!=''){this.tooltip=React.createElement(api.ElementTooltip,{hint:api.Text.parse(this.props.control.hint,true),position:'right'});}},initActions:function(){this.parent();if(this.state.chosen!==false&&this.props.control.chosen!==false){this.loadingChosenTimer&&clearTimeout(this.loadingChosenTimer);this.loadingChosenTimer=setTimeout(function(){api.Ajax.loadStylesheet(api.urls.root+'/media/jui/css/chosen.css');api.Ajax.loadScript(api.urls.root+'/media/jui/js/chosen.jquery.min.js',this.initChosen.bind(this));}.bind(this),500);}var tooltip=(this.refs.wrapper||ReactDOM.findDOMNode(this)).querySelector('.has-tooltip');if(tooltip){tooltip=api.findReactComponent(tooltip);if(tooltip){tooltip.forceUpdate();}}},initChosen:function(options,force){if(jQuery.fn.chosen===undefined){return;}var options=options||{disable_search:true};var selects;try{selects=(this.refs.wrapper||ReactDOM.findDOMNode(this)).querySelectorAll('select');}catch(e){selects=[];}for(var i=0;i<selects.length;i++){if(force&&selects[i]._initialized_chosen){delete selects[i]._initialized_chosen;jQuery(selects[i]).chosen('destroy');}if(selects[i]._initialized_chosen){jQuery(selects[i]).trigger('liszt:updated');}else{jQuery(selects[i]).chosen(options).on('change',function(event){if(event.target.name){this.change(event);}}.bind(this));selects[i]._initialized_chosen=true;}}},deinitActions:function(){this.parent();var selects=(this.refs.wrapper||ReactDOM.findDOMNode(this)).querySelectorAll('select');for(var i=0;i<selects.length;i++){if(selects[i]._initialized_chosen){delete selects[i]._initialized_chosen;jQuery(selects[i]).chosen('destroy');}}},change:function(event){var setting=this.props.setting,value;if(arguments.length==2&&arguments[0]==setting){value=arguments[1];}else{var control=event.target?event.target:event;if(control.nodeName=='SELECT'){if(control.multiple){var options=control.querySelectorAll('option');value=[];for(var i=0,n=options.length;i<n;i++){if(options[i].selected){value.push(options[i].value);}}}else{value=control.options[control.selectedIndex].value;}}else if(control.nodeName=='INPUT'){if(control.type=='checkbox'){if(control.name.substr(-2)=='[]'){value=[];var container=control.parentNode;while(!container.classList.contains('form-group')&&container.nodeName!='BODY'){container=container.parentNode;}var checkboxes=container.querySelectorAll('input');for(var i=0,n=checkboxes.length;i<n;i++){if(checkboxes[i].checked){value.push(checkboxes[i].value);}}}else{value=control.checked?control.value:null;}}else if(control.type=='radio'){value=control.checked?control.value:null;}else{value=control.value;}}else{value=control.value;}if(control.nodeName!='TEXTAREA'&&['checkbox','radio'].indexOf(control.type)>-1){this.props.form.skipSaving=false;}}if(typeof value=='string'&&value.match(/^[\[\{].+[\}\]]$/)){value=JSON.parse(value);}if(this.props.form.skipSaving){this.setState({value:value});}this.props.form.updateState(setting,value);},resetState:function(event){if(this.state.value!=''){this.change(this.props.setting,'');}},renderPopupInput:function(title,allowCustomInput){if(!this.props.id){this.props.id=api.Text.toId();}return React.createElement('div',{key:this.props.id,className:'form-group '+(this.props.control['class']||this.props.control.className||'')},React.createElement('label',{className:this.props.control.labelClass||''},this.label,this.tooltip),React.createElement('div',{className:'input-group '+(this.props.control.inputClass||'')},React.createElement('input',{id:this.props.id,ref:'field',type:'text',name:this.props.setting,value:this.value||this.state.value,disabled:allowCustomInput?false:true,className:'form-control',onChange:allowCustomInput?this.change:null}),React.createElement('span',{className:'input-group-append'},React.createElement('a',{href:'javascript:void(0)',onClick:this.popupForm.bind(this,title||this.props.control.type),className:'input-group-text'},'...')),React.createElement('span',{className:'input-group-append'},React.createElement('a',{href:'javascript:void(0)',onClick:this.resetState,className:'input-group-text'},React.createElement('i',{className:'fa fa-remove'})))));},popupForm:function(title){var data=this.popupData();if(!data.form&&data.rows){data={form:data};}if(!data.rel){data.rel=this;}if(!data.editor&&this.props.form.props.editor){data.editor=this.props.form.props.editor;}if(!data.values){data.values=this.state.value;}if(!data.form['class']){data.form['class']='container-fluid';}else{data.form['class']+=' container-fluid';}api.Modal.get({id:api.Text.toId(title),type:'form',title:title,content:data});},saveSettings:function(values){this.change(this.props.setting,values);}});})((JSN=window.JSN||{}));