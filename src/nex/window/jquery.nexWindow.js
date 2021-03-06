/*
jquery.nexWindow.js
http://www.extgrid.com/window
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

*/

;(function($){
	"use strict";
	var win = Nex.define('Nex.Window','Nex.Html').setXType('window');
	win.extend({
		version : '1.0',
		_Tpl : {				
		}
	});
	win.setOptions(function(opt,t){
		return {
			prefix : 'nexwindow-',
			autoDestroy : true,
			autoResize : true,
			_hasBodyView : true,
			_checkScrollBar : false,
			position : 'absolute',
			border : true,
			borderCls : [opt.borderCls,'nex-window-border'].join(' '),
			containerCls : [opt.containerCls,'nex-window'].join(' '),
			autoScrollCls : [opt.autoScrollCls,'nex-window-auto-scroll'].join(' '),
			autoScroll : false,
			autoShow : true,
			closeToRremove : true,//关闭窗口后 销毁对象
			draggable : true,
			resizeable : false,
			modal : false,
			focusToTop : true,//点击窗口后最顶层显示
			zIndex : (function(){
				var zIndex = Nex['zIndex']+2;
				Nex['zIndex'] = zIndex;
				return zIndex;
			})(),
			refreshPosOnResize : true,//通过调用resize时会重置窗口显示位置
			point : null,//point : {left:0,top:0},
			showAt : {},
			title : '',
			toolsItems : [],//更自由的自定义组件显示
			toolsIcons : [],//自定义图标显示 {icon:'abc',text:'',callBack:func}
			collapseable : false,
			collapsed :　false,
			minable : false,
			maxable : false,
			hideHeader : false,
			headerSelectionable : true,
			closeable : false,
			headerItemsCls : '',
			footerItemsCls : '',
			headerItems : null,//string xobject [ xobject ] jquery...
			footerItems : null,
			html : '',
			items : [],
			padding : 0,
			style : '',
			renderTo : window,
			url : '',//支持远程创建 返回数据格式  json
			cache : true,
			dataType : 'json',
			queryParams : {},
			method : 'get',
			parames : {},
			views : {},
			cls : '',
			headerCls : '',
			modalCls : '',
			bodyCls : '',
			bodyStyle : {},
			icon : '',
			iconCls : '',
			iconTitle : '',
			iconTag : 'span',
			autoSize : false,
			width : 'auto',
			height : 'auto',
			animShow : false,//是否动画显示
			animShowType : 'showInAt',
			animHideType : 'showOutAt',
			denyEvents : [ 'scroll' ],
			animateShow : {
				xtype : 'showInAt'	
			},//动画显示函数
			animateHide : {
				xtype : 'showOutAt'		
			},//动画关闭函数
			maxWidth : function(){
				var self = this;
				var opt = self.configs;
				var renderTo = this.C('renderTo');	
				if( $.isWindow(opt.renderTo) ) {
					return $(renderTo).width();
				} else {
					return 0;		
				}
			},
			maxHeight : function(){
				var self = this;
				var opt = self.configs;
				var renderTo = this.C('renderTo');
				if( $.isWindow(opt.renderTo) ) {
					return $(renderTo).height();
				} else {
					return 0;	
				}
			},
			minHeight : 100,
			minWidth : 200,
			events : {
				onStart : $.noop,
				onCreate : $.noop,
				onDestroy : $.noop
			}
		};	
	});
	win.fn.extend({
		_init : function(opt) {
			var self = this;
			self.setContainer();//setContainer必须
			if( !opt.hideHeader ) {	
				self.setHeader();
			}
			self.setHeaderItems()
				.setBody()
				.setFooter()
				.createModal()
				.initWindow();		
		},
		_sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			Nex.Html.fn._sysEvents.apply(self,arguments);
			
			self.bind("onHeaderCreate",self._drag,self);
			self.bind("onCreate",self._resizeable,self);
			self.bind("onCreate",self._setTopzindex,self);
			//self.bind("onHeaderCreate",self.displayHeader,self);
			return self;
		},
		displayHeader : function(m){
			var self = this;
			var opt = self.configs;
			var header = opt.views['header'];
			if( !header ) { 
				return false;
			}
			if( m ) {
				header.show();	
			} else {
				header.hide();	
			}
		},
		showHeader : function(){
			return this.displayHeader( true );	
		},
		hideHeader : function(){
			return this.displayHeader( false );	
		},
		setzIndex : function(){
			var self = this;
			var opt = self.configs;		
			var container = opt.views['container'];
			var zIndex = Nex['zIndex']+2;
			Nex['zIndex'] = zIndex;
			opt.zIndex = zIndex; 
			
			container.css('z-index',opt.zIndex);
			var modal = false;	
			if( opt.modal && ('modal' in opt.views) ) {
				modal = opt.views['modal'];
				modal.css('z-index',opt.zIndex-1);
			}		
		},
		_setTopzindex : function(){
			var self = this;
			var opt = self.configs;	
			
			if( !opt.focusToTop ) return;
			
			var container = opt.views['container'];
			
			container.bind('mousedown.zindex',function(e){
				self.setzIndex();
			});
		},
		_drag : function(){
			var self = this;
			var opt = self.configs;
			if( !opt.draggable || !Nex.draggable ) return;
			var header = opt.views['header'];
			Nex.Create('draggable',{
				helper : header,
				target:opt.views['container'],
				onBeforeDrag : function(e,_opt){
					
					if( !opt.draggable ) return false;
					
					var r = self.fireEvent("onWindowBeforeDrag",[e,_opt]);	
					if( r === false) return r;
				},
				onStartDrag : function(e,_opt){
					var r = self.fireEvent("onWindowStartDrag",[e,_opt]);	
					if( r === false) return r;
				},
				onDrag : function(e,_opt){
					var r = self.fireEvent("onWindowDrag",[e,_opt]);	
					if( r === false) return r;
				},
				onStopDrag : function(e,_opt){
					var r = self.fireEvent("onWindowStopDrag",[e,_opt]);	
					if( r === false) return r;
				}
			});
			//header.draggable({target:opt.views['container']});
		},
		_resizeable : function(){
			var self = this;
			var opt = self.configs;
			if( !opt.resizeable || !Nex.resizable ) return;
			var container = opt.views['container'];
			
			Nex.Create('resizable',{
				target : container,
				minWidth: opt.minWidth,	
				minHeight: opt.minHeight,
				//maxWidth: opt.maxWidth,	
				//maxHeight: opt.maxHeight,
				onBeforeResize : function(e,_opt){
					
					if( opt.autoSize || !opt.resizeable || opt.collapsed ) return false;
					
					var r = self.fireEvent("onWindowBeforeResize",[e,_opt]);	
					if( r === false) return r;	
				},
				onStartResize : function(e,_opt){
					var r = self.fireEvent("onWindowStartResize",[e,_opt]);	
					if( r === false) return r;	
				},
				onResize : function(w,h,e,_opt){
					var r = self.fireEvent("onWindowResize",[w,h,e,_opt]);	
					if( r === false) return r;	
					self.setWH( _opt.width,_opt.height );	
				},
				onStopResize : function(w,h,e,_opt){
					var r = self.fireEvent("onWindowStopResize",[w,h,e,_opt]);	
					if( r === false) return r;	
				}
			});
			/*container.resizable({
				minWidth: opt.minWidth,
				minHeight: opt.minHeight,
				onResize:function(w,h){
				self.setWH( w,h );		
			}});*/
		},
		setContainer : function(){
			var self = this;
			var opt = self.C();
			var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
			if( render.css('position') === 'static' ) {
				render.css('position','relative');	
			}
			//防止重复创建相同ID的窗口
			$("#"+opt.id).remove();
			$("#"+opt.id+'_modal').remove();
			
			self.lockEvent('onContainerCreate');
			
			opt.containerCls += ' nex-window-'+opt.position;
			
			Nex.Html.fn.setContainer.call(self);
			
			self.unLockEvent('onContainerCreate');
			/*var container = $('<div class="nex-window '+( opt.autoScroll ? 'nex-window-auto-scroll' : '' )+' nex-window-'+opt.position+' '+opt.cls+'" id="'+opt.id+'"></div>');
			opt.views['container'] = container;*/
			var container = opt.views['container'];
			
			container._removeStyle('padding');
			
			container.css('z-index',opt.zIndex);
			render.append(container);
			self.fireEvent("onContainerCreate",[container,opt]);
			return self;
		},
		_hide : function( func ){
			var self = this,undef;
			var opt = self.configs;	
			var container = opt.views['container'];
			var modal = false;	
			if( opt.modal && ('modal' in opt.views) ) {
				modal = opt.views['modal'];
			}	
			opt._isShow = false;
			if( modal ) {
				modal.hide();
			}
			if( opt.animShowType && opt.animShow ) {
				var d = $.extend( {},opt.showAt,{ 
					xtype : opt.animHideType || 'showAt',
					source:container,
					onShow : function(){
						if( $.isFunction(func) ) {
							func.call( self );	
						}	
					}
				 } );
				 
				Nex.Create(d).show();
			} else {
				container.hide();
				func.call( self );		
			}
		},
		_show : function(func){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var modal = false;	
			if( opt.modal && ('modal' in opt.views) ) {
				modal = opt.views['modal'];
			}
			
			if( opt._isShow ) {
				return;	
			}
			opt._isShow = true;
			//animateShow
			self.setzIndex();//设置z-index 重要...
			
			if( opt.showAt.at ) {
				opt.showAt.el = opt.showAt.at;
			}
			
			opt.showAt.el = opt.showAt.el === undef ? (opt.point === null ? opt.renderTo : opt.point) : opt.showAt.el;
			
			//container.show()
			//		 .showAt(opt.showAt);
			
			if( modal ) {
				modal.show();
			}
			var animShowType = 'showAt';
			if( opt.animShow && opt.animShowType ) {
				animShowType = opt.animShowType
			}
			//animShowType
			var d = $.extend( {},opt.showAt,{ 
				xtype : animShowType,
				source:container,
				onShow : function(){
					if( $.isFunction(func) ) {
						func.call( self );	
					}	
				}
			 } );
			Nex.Create(d).show();	
			
		},
		resetPosition : function(){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			if( opt.showAt.at ) {
				opt.showAt.el = opt.showAt.at;
			}
			
			opt.showAt.el = opt.showAt.el === undef ? (opt.point === null ? opt.renderTo : opt.point) : opt.showAt.el;
			var d = $.extend( {},opt.showAt,opt.animateShow,{ 
				source:container
			 } );
			
			if( !opt.animShow ) {
				d.xtype = 'showAt';	
			}
			
			var anim = Nex.Create(d),
				pos = {};
			if( anim ) {
				pos = anim.getShowPos();		
			}
			container.stop(true,true).animate( pos,200,function(){
				self.fireEvent("onResetPosition",[container,opt]);													
			} );
		},
		maxWindow : function(btn){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			var r = self.fireEvent("onBeforeMaxWindow",[container,opt]);
			if( r === false ) return r;
			
			var btn = btn === undef ? $('.nex-window-max-icon',header) : btn;
			
			var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
			render.addClass('nex-window-noscroll');
			
			btn.addClass('nex-window-max-icon-reset');
			
			opt.__mOffset = self.getPosition();
			container.css({
							left : 0,
							top : 0
						});
			opt.__mWidth = opt.width;
			opt.__mHeight = opt.height;
			opt.__mdraggable = opt.draggable;
			opt.__mresizeable = opt.resizeable;
			opt.__mautosize = opt.autoSize;
			opt.autoSize = opt.resizeable = opt.draggable = false;
			
			self.initWH('100%','100%');	
			
			if( opt.collapsed ) {
				container.height( header._height() );	
				if( opt._mAutoResize ) {	
					Nex.Manager._resize(opt.id,true);
				}
			}
			
			self.fireEvent("onMaxWindow",[container,opt]);
			
		},
		maxResetWindow : function(btn){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			var r = self.fireEvent("onBeforeMaxResetWindow",[container,opt]);
			if( r === false ) return r;
			
			var btn = btn === undef ? $('.nex-window-max-icon',header) : btn;
			
			var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
			render.removeClass('nex-window-noscroll');
			
			btn.removeClass('nex-window-max-icon-reset');
			
			opt.width = opt.__mWidth || opt.width;
			opt.height = opt.__mHeight || opt.height;
			
			opt.draggable = self._undef(opt.__mdraggable,opt.draggable);
			opt.resizeable = self._undef(opt.__mresizeable,opt.resizeable);
			opt.autoSize = self._undef(opt.__mautosize,opt.autoSize);
			
			self.initWH(opt.__mWidth,opt.__mHeight);	
			
			if( opt.__mOffset ) {
				container.css(opt.__mOffset);
			}
			
			if( opt.collapsed ) {
				container.height( header._height() );		
				if( opt._mAutoResize ) {	
					Nex.Manager._resize(opt.id,true);
				}
			}
			
			self.fireEvent("onMaxResetWindow",[container,opt]);
			
		},
		minWindow : function(e1,e2){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			var e1 = e1 === undef ? 'onBeforeMinWindow' : e1;
			var e2 = e2 === undef ? 'onMinWindow' : e2;
			
			var r = self.fireEvent(e1,[container,opt]);
			if( r === false ) return r;
			
			var modal = false;	
			if( opt.modal && ('modal' in opt.views) ) {
				modal = opt.views['modal'];
			}	
			container.addClass('nex-window-hidden');
			if( modal ) {
				modal.addClass('nex-window-hidden');
			}
			
			opt._mAutoResize = opt.autoResize;
			self.disabledAutoResize();
			
			self._hide(function(){
				self.fireEvent(e2,[container,opt]);					
			});
		},
		minResetWindow : function(e1,e2){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			opt._mAutoResize = opt._mAutoResize === undef ? opt.autoResize : opt._mAutoResize;
			
			var e1 = e1 === undef ? 'onBeforeMinResetWindow' : e1;
			var e2 = e2 === undef ? 'onMinResetWindow' : e2;
			
			var r = self.fireEvent(e1,[container,opt]);
			if( r === false ) return r;
			
			var modal = false;	
			if( opt.modal && ('modal' in opt.views) ) {
				modal = opt.views['modal'];
			}	
			container.removeClass('nex-window-hidden');
			if( modal ) {
				modal.removeClass('nex-window-hidden');
			}
			//恢复	
			var func = opt._mAutoResize ? 'enableAutoResize' : 'disabledAutoResize';
			self[func]();
			
			self._show(function(){
				self.resize();
				self.fireEvent(e2,[container,opt]);		
				self.fireEvent('onWindowShow',[opt]);					
			});
			
		},
		closeWindow : function(){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			if( !opt.closeToRremove ) {
				self.minWindow('onBeforeCloseWindow','onCloseWindow');	
			} else {
				var r = self.fireEvent('onBeforeCloseWindow',[container,opt]);
				if( r === false ) return r;
				opt._closed = true;
				self._hide(function(){
					opt.views['container'] = container.detach();
					var modal = false;	
					if( opt.modal && ('modal' in opt.views) ) {
						opt.views['modal'] = opt.views['modal'].detach();
					}	
					self.fireEvent('onCloseWindow',[container,opt]);
					self.fireEvent('onWindowHide',[opt]);
				});
			}
		},
		openWindow : function(){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			if( !opt.closeToRremove ) {
				self.minResetWindow('onBeforeOpenWindow','onOpenWindow');	
			} else {
				opt._closed = opt._closed === undef ? false : opt._closed;
				if( opt._closed ) {
					var r = self.fireEvent('onBeforeOpenWindow',[container,opt]);
					if( r === false ) return r;
					var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
					container.appendTo( render );
					var modal = false;	
					if( opt.modal && ('modal' in opt.views) ) {
						modal = opt.views['modal'];
						modal.appendTo( render );
					}	
				}
				self._show(function(){
					self.resize();	
					self.fireEvent('onOpenWindow',[container,opt]);
				});
			}
		},
		collapseWindow : function(btn){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			var r = self.fireEvent("onBeforeCollapseWindow",[container,opt]);
			if( r === false ) return r;
			
			var btn = btn === undef ? $('.nex-window-collapse-icon',header) : btn;
			btn.addClass('nex-window-collapse-icon-collapsed');	
			
			opt.collapsed = true;
			opt._mAutoResize = opt.autoResize;
			self.disabledAutoResize();
			container.animate({
				height : header._height()  
			},300);	
			self.fireEvent("onCollapseWindow",[container,opt]);
		},
		expandWindow : function(btn){
			var self = this,undef;
			var opt = self.configs;		
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			var r = self.fireEvent("onBeforeExpandWindow",[container,opt]);
			if( r === false ) return r;
			
			var btn = btn === undef ? $('.nex-window-collapse-icon',header) : btn;
			btn.removeClass('nex-window-collapse-icon-collapsed');	
			
			opt.collapsed = false;
			var func = opt._mAutoResize ? 'enableAutoResize' : 'disabledAutoResize';
			self[func]();
			container.animate({
				height : opt._height - ( container._outerHeight() - container._height() )
			},300);	
			self.fireEvent("onExpandWindow",[container,opt]);
		},
		bindHeaderEvent : function(){
			var self = this;
			var opt = self.configs;	
			var container = opt.views['container'];
			var header = opt.views['header'];
			
			if( opt.closeable ) {
				$('a.nex-window-close-icon',header).click(function(e){
					self.closeWindow();
					$(document).trigger('click',[e]);
					return false;
				});
			}
			if( opt.maxable ) {
				$('.nex-window-max-icon',header).click(function(e){
					var btn = $(this);
					if( btn.hasClass('nex-window-max-icon-reset') ) {
						self.maxResetWindow(btn);		
					} else {
						self.maxWindow(btn);		
					}	
					$(document).trigger('click',[e]);
					return false;				   
				});
			}
			if( opt.minable ) {
				$('.nex-window-min-icon',header).click(function(e){													
					/*if( container.hasClass('nex-window-hidden') ) { 
						self.minResetWindow();
					} else {
						self.minWindow();
					}*/
					self.minWindow();
					$(document).trigger('click',[e]);
					return false;
				});	
			}
			if( opt.collapseable ) {
				$('.nex-window-collapse-icon',header).click(function(e){
					var btn = $(this);												  
					if( $(this).hasClass('nex-window-collapse-icon-collapsed') ) {
						self.expandWindow(btn);
					} else {
						self.collapseWindow(btn);
					}	
					$(document).trigger('click',[e]);
					return false;				   
				});
			}
		},
		setHeader : function(){
			var self = this;
			var opt = self.C();	
			var container = opt.views['container'];
			
			if( opt.views['header'] ) return self;
			var icon = '';
			if( opt.icon || opt.iconCls ) {
				var _icon = '';
				if( opt.icon ) {
					_icon = 'background-image:url('+opt.icon+')';	
				}
				var ititle = '';
				if( opt.iconTitle ) {
					ititle = 'title="'+opt.iconTitle+'"';	
				}
				icon = '<'+opt.iconTag+' '+ititle+' class="nex-window-icon '+opt.iconCls+'" style="'+_icon+'"></'+opt.iconTag+'>';	
			}
			//var header = $('<div class="nex-window-header '+opt.headerCls+'" id="'+opt.id+'_header" style=""><table class="nex-window-header-table" cellpadding="0" cellspacing="0" border="0"><tr><td>'+icon+'</td><td><span class="nex-window-title-text"></span></td></tr></table><div class="nex-window-tools"></div></div>');
			var header = $('<div class="nex-window-header '+opt.headerCls+'" id="'+opt.id+'_header" style=""><div class="nex-window-tools"></div><div class="nex-window-header-title">'+icon+'<span class="nex-window-title-text"></span></div></div>');
			
			opt.views['header'] = header;
			container.prepend(header);
			if( !opt.headerSelectionable ) {
				header.disableSelection();
			}
			self.addComponent( $('.nex-window-title-text',header),opt.title );
			var icons = [];
			if( opt.closeable ) {
				icons.push('close');
			}
			if( opt.maxable ) {
				icons.push('max');
			}
			if( opt.minable ) {
				icons.push('min');
			}
			if( opt.collapseable ) {
				icons.push('collapse');
			}
			icons.reverse();
			var tools = $('>.nex-window-tools',header);
			if( opt.toolsItems.length ) {
				self.addComponent( tools,opt.toolsItems );
			}
			for( var i=0;i<opt.toolsIcons.length;i++ ) {
				var __d = {
					icon : '',
					text : ''
				};
				var iconData = 	opt.toolsIcons[i];
				iconData = $.extend( __d,iconData );
				
				if( !$._isPlainObject( iconData ) ) {
					continue;	
				}
				var _icon = $('<a class="nex-window-icon '+iconData.icon+'" hideFocus=true href="javascript:void(0)">'+iconData.text+'</a>');
				tools.append( _icon );
				(function(cdata){
					_icon.click(function(e){
						if( $.isFunction( cdata.callBack ) ) {
							cdata.callBack.call( self,_icon,e );	
						}					 
					});	
				})(iconData);
			}
			for( var i=0;i<icons.length;i++ ) {
				tools.append( $('<a class="nex-window-icon nex-window-'+icons[i]+'-icon" hideFocus=true href="javascript:void(0)"></a>') );	
			}
			
			self.bindHeaderEvent();
			
			self.fireEvent("onHeaderCreate",[header],opt);
			
			if( opt.hideHeader ) {
				self.setWH();
			}
			
			return self;
		},
		setHeaderItems : function(){
			var self = this,undef;
			var opt = self.C();	
			var container = opt.views['container'];	
			
			var headerItems = opt.headerItems;
			if( $.isFunction( headerItems ) ) {
				headerItems = headerItems.apply( self,arguments );
				if( headerItems === undef ) {
					headerItems = null;	
				}	
			}
			
			if( headerItems === null || headerItems === '' ) return self;
			
			var headerItem = $('<div class="nex-window-header-items '+opt.headerItemsCls+'" id="'+opt.id+'_header_items" style=""></div>');
			container.append(headerItem);
			opt.views['headerItem'] = headerItem;
			
			self.addComponent( headerItem,headerItems );
			return self;
		},
		bindBodyEvents : function(){
			var self = this;
			var opt = self.configs;	
			var bd = opt.views['body'];
			var callBack = function(type,e){
				var r = self.fireEvent(type,[ this,e,opt ]);
				if( r === false ) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			bd.unbind('.window');
			var events = {
				'scroll.window' : function(e){
					callBack.call(this,'onScroll',e);
					var $this = $(this);
					if( $this.scrollTop()<=0 ) {
						self.fireEvent('onScrollTopStart',[ this,e,opt ]);		
					} else if( $this.scrollLeft()<=0 ) {
						self.fireEvent('onScrollLeftStart',[ this,e,opt ])
					}
					if( self.isScrollEnd( this,'top' ) ) {
						self.fireEvent('onScrollTopEnd',[ this,e,opt ]);	
					}
					if( self.isScrollEnd( this,'left' ) ) {
						self.fireEvent('onScrollLeftEnd',[ this,e,opt ]);	
					}
				}
			};
			bd.bind(events);
		},
		setBody : function(){
			var self = this;
			var opt = self.configs;	
			var container = opt.views['container'];
			var bd = $( '<div class="nex-window-body '+opt.bodyCls+'" id="'+opt.id+'_body" class="" style=""></div>' );
			opt.views['body'] = bd;
			container.append(bd);
			bd.css('padding',opt.padding);
			bd.css(opt.bodyStyle);
			self.bindBodyEvents();	 
			self.fireEvent("onBodyCreate",[bd],opt);
			return self;
		},
		setFooter : function(){
			var self = this,undef;
			var opt = self.C();	
			var container = opt.views['container'];
			
			var footerItems = opt.footerItems;
			if( $.isFunction( footerItems ) ) {
				footerItems = footerItems.apply( self,arguments );
				if( footerItems === undef ) {
					footerItems = null;	
				}	
			}
			
			if( footerItems === null || footerItems === '' ) return self;
			
			var footer = $('<div class="nex-window-footer '+opt.footerItemsCls+'" id="'+opt.id+'_footer" style=""></div>');
			opt.views['footer'] = footer;
			
			container.append(footer);	
			
			self.addComponent( footer,footerItems );
			
			self.fireEvent("onFooterCreate",[footer],opt);
			
			return self;
		},
		createModal : function (){
			var self = this;
			var opt = self.C();	
			
			if( !opt.modal ) return self;
			
			var container = opt.views['container'];
			var modal = $('<div class="nex-window-modal '+opt.modalCls+'" id="'+opt.id+'_modal" style=""></div>');	
			opt.views['modal'] = modal;
			
			modal.css( 'zIndex',opt.zIndex-1 );

			modal.bind({
				'click' : function(e){
					self.fireEvent('onModalClick',[modal,e,opt]);
					$(document).trigger('click',[e]);
					return false;
				},
				'dblclick' : function(e){
					self.fireEvent('onModalDblClick',[modal,e,opt]);
					$(document).trigger('dblclick',[e]);
					return false;
				},
				'mousedown' : function(e){
					self.fireEvent('onModalMouseDown',[modal,e,opt]);
					$(document).trigger('mousedown',[e]);
					return false;	
				},
				'mouseup' : function(e){
					self.fireEvent('onModalMouseUp',[modal,e,opt]);
					$(document).trigger('mouseup',[e]);
					return false;	
				},
				'keydown' : function(e){
					self.fireEvent('onModalKeyDown',[modal,e,opt]);
					$(document).trigger('keydown',[e]);
					return false;		
				},
				'keyup' : function(e){
					self.fireEvent('onModalKeyUp',[modal,e,opt]);
					$(document).trigger('keyup',[e]);
					return false;		
				},
				'mousewheel' : function(e){
					self.fireEvent('onModalMouseWheel',[modal,e,opt]);	
				},
				'mouseover' : function(e){
					self.fireEvent('onModalMouseOver',[modal,e,opt]);
					$(document).trigger('mouseover',[e]);
					return false;		
				},
				'mouseout' : function(e){
					self.fireEvent('onModalMouseOut',[modal,e,opt]);
					$(document).trigger('mouseout',[e]);
					return false;		
				}
			});
			
			container.after(modal);	
			self.fireEvent("onModelCreate",[modal],opt);
			return self;
		},
		showModal : function (){
			var self = this;
			var opt = self.C();	
			//如果开启modal 应该是不能出现滚动条的
			//var render = $(opt.renderTo);
			//render.addClass('nex-window-noscroll');
			
			opt.views['modal'].show();
		},
		hideModal : function (){
			var self = this;
			var opt = self.C();	
			
			//var render = $(opt.renderTo);
			//render.removeClass('nex-window-noscroll');
			
			opt.views['modal'].hide();
		},
		getPosition : function(){
			var self = this;
			var opt = self.C();	
			var container = opt.views['container'];
			if( $.isWindow(opt.renderTo) ) {
				return 	container.position();
			} else {
				var sLeft = $(opt.renderTo).scrollLeft();
				var sTop = $(opt.renderTo).scrollTop();	
				var pos = container.position();
				return {
						left　: sLeft + pos.left,
						top　: sTop + pos.top
					}
			}
		},
		getHeader : function(){
			var self = this,
				opt = self.configs;
			return opt.views['header'];	
		},
		getHeaderItem : function(){
			var self = this,
				opt = self.configs;
			return opt.views['headerItem'];	
		},
		getBody : function(){
			var self = this,
				opt = self.configs;
			return opt.views['body'];
		},
		getFooter : function(){
			var self = this,
				opt = self.configs;
			return opt.views['footer'];	
		},
		/*
		onViewSizeChange : function(func){
			var self = this;
			var opt = self.C();	
			var container = opt.views['container'];	
			self.resetViewSize();
			self.resetModelSize();		
			Nex.html.fn.onViewSizeChange.apply(self,arguments);
		},
		*/
		/*onSizeChange : function(w,h){
			var self = this,
				opt=this.configs,
				undef;
			if( opt.autoSize ){
				self.autoSize();	
			} else {
				self._onSizeChange(w,h);	
			}
		},*/
		resetModelSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			
			if( !opt.modal ) return self;
			if( !( 'modal' in opt.views ) ) return self;

			var render = $(opt.renderTo);
			
			var  isWin = $.isWindow( opt.renderTo );
			
			var modal = opt.views['modal'];
			
			var w = isWin ? 0 : parseInt(render.css('paddingLeft')) + parseInt(render.css('paddingRight'));
			var h = isWin ? 0 : parseInt(render.css('paddingTop')) + parseInt(render.css('paddingBottom'));
			
			var mw = render._width() + w,
				mh = render._height() + h;
			
			if( isWin ) {
				var winWidth = $(window).width();
				var winHeight = $(window).height();
				w = parseInt($(document.body).css('paddingLeft')) + parseInt($(document.body).css('paddingRight'));
				h = parseInt($(document.body).css('paddingTop')) + parseInt($(document.body).css('paddingBottom'));
				mw = Math.max( winWidth,$(document.body).width() + w );
				mh = Math.max( winHeight,$(document.body).height() + h );
			}
			
			modal._outerWidth( mw );
			modal._outerHeight( mh );
			
			self.fireEvent('onModelSizeChange',[ opt ]);
		},
		_setViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var container = opt.views['container'];	
			var bd = self.getBody();
			
			if( opt.realWidth !== 'auto' ) {
				bd._outerWidth( container._width() );
			}
			if( opt.realHeight !== 'auto' ) {
				var h = 0;
				$.each( opt.views,function(key,item){
					if( key === 'body' || key === 'container' || key === 'modal' ) return;
					h += item._outerHeight();
				} );
				bd._outerHeight( container._height()-h );
			}
			self.fireEvent("onSetViewSize",[opt]);
			
			self.resetModelSize();
			//self.fireEvent('onViewSizeChange',[ opt ]);
		},
		initWH : function(w,h){
			var self = this,
				opt = self.C();
			self.setWH(w,h);
		},
		resize : function(m){
			var self = this,
				opt = self.C(),
				undef;
			
			opt._rt = opt._rt || 0;
			
			if( opt._rt ) {
				clearTimeout( opt._rt );	
			}
			
			opt._rt = setTimeout(function(){
				self._setBodyOverflowHidden();	
				self.setWH();	
				if( opt.refreshPosOnResize ) {
					self.resetModelSize();
					self.resetPosition();
				}
				
			},0);
			return self;
		},
		/*
		*清空window内容
		*/
		empytContent : function(){
			return this.empty();
		},
		_addContent : function(items,after){
			return this._insert( items,after );
		},
		/*
		*向window追加内容
		*/
		addContent : function(items,after){
			return this.insert( items,after );
		},
		initWindow : function(){
			var self = this,
				opt=this.configs;
				
			Nex.Html.fn.initComponent.apply(self,arguments);
			
			var container = opt.views['container'];
			container.hide();
			if( opt.autoShow ) {
				self.openWindow();	
			}
			//self.fireEvent('onCreate',[ opt ]);
			
			return self;
		},
		hide :　function(){
			var self = this;
			var opt = self.configs;	
			self.closeWindow();
		},
		//默认显示函数
		show : function(){
			var self = this,
				opt=this.configs;	
			self.openWindow();	
		}
	});
})(jQuery);