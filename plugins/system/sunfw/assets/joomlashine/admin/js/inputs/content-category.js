var InputContentCategory=api.InputContentCategory=extendReactClass('MixinInput',{getDefaultProps:function(){return{getCategoryList:api.urls.ajaxBase+'&action=getContentCategory'};},getInitialState:function(){return{value:this.props.value,options:[]};},componentWillMount:function(){api.__parent__();this.loading=true;api.Ajax.request(this.props.getCategoryList,function(req){var response=req.responseJSON;this.loading=false;if(response.type=='success'){this.setState({options:response.data});}}.bind(this));},render:function(){var options=[],selected;if(this.loading){options.push(React.createElement('option',{value:''},api.Text.parse('loading')));}this.state.options.map(option=>{if(this.props.control.multiple){selected=this.state.value.indexOf(option.value)>-1?true:false;}else{selected=this.state.value==option.value?true:false;}options.push(React.createElement('option',{value:option.value,selected:selected,disabled:option.disable},option.text));});return React.createElement('div',{key:this.props.id||api.Text.toId(),className:'form-group '+(this.props.control.className?this.props.control.className:'')},React.createElement('label',null,this.label,this.tooltip),React.createElement('select',{ref:'field',name:this.props.setting+(this.props.control.multiple?'[]':''),multiple:this.props.control.multiple?true:false,onChange:this.change,className:'form-control'},options));},initActions:function(){api.__parent__();if(this.refs.field&&!this._initialized_chosen){this.initChosen({disable_search:false},true);this._initialized_chosen=true;}}});