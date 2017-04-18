/**
 * @fileOverview 设置 - 网络设置 - UPnP
 */
(function() {
    var UPnP, modifyDialog = {};
    var initModify = 0; //当前修改行
    var timeoutID; // 超时调用ID
    var PortMapStatusArray = [];
    var self = Page.UPnPConfig = {

        init: function() {
            self.configManager = new ConfigManager();
            self.netApp = new NetApp();
            self._tabListInit();
            self.translate();
            self.render();
            self.bind();
        },

        translate: function() {
            $('upnp_help').set('title', tl('w_help'));
            $('upnp_enable_label').set('text', tl('w_Startup UPNP'));
            if (isEnable('is_show_upnpMode')) {
                $('upnp_status_label').set('text', tl('w_RouterState'));
                $('upnp_mapState').set('text', tl('w_State'));
            } else {
                $('upnp_status_label').set('text', tl('w_State'));
            }

            $('upnp_list_title').set('text', tl('w_Port MappingList'));
            $('upnp_service_name').set('text', tl('w_ServerName'));
            $('upnp_protocol').set('text', tl('w_Protocol'));
            $('upnp_inner_port').set('text', tl('w_Inner Port'));
            $('upnp_outer_port').set('text', tl('w_Outer Port'));
            // 按钮
            $('upnp_add_item').set('text', tl('w_Add Mapping'));
            $('upnp_default').set('text', tl('w_DefaultConfig'));
            $('upnp_refresh').set('text', tl('w_Refresh'));
            $('upnp_confirm').set('text', tl('w_Confirm'));
            // 弹出框
            $('upnp_add_enable_on_label').set('text', tl('w_on'));
            $('upnp_add_enable_off_label').set('text', tl('w_off'));
            $('upnp_add_protocol_label').set('text', tl('w_Protocol'));
            $('upnp_add_inner_port_label').set('text', tl('w_Inner Port'));
            $('upnp_add_outer_port_label').set('text', tl('w_Outer Port'));
            $('upnp_add_confirm').set('text', tl('w_Confirm'));
            $('upnp_add_cancel').set('text', tl('w_Cancel'));
            $('upnp_discover_label').set('text', tl('w_discover'));
            $('upnp_mode_label').set('text', tl('w_Mode'));
            $('upnp_manual_label').set('text', tl('w_Manual'));
            $('upnp_auto_label').set('text', tl('w_Auto'));
            $$('#upnp_add h1').set('text', tl('w_Add Mapping'));

            //修改弹出框翻译
            $('upnp_modify_item').set('text', tl('w_Amend'));
            $('upnp_modify_protocol_label').set('text', tl('w_Protocol'));
            $('upnp_modify_inner_port_label').set('text', tl('w_Inner Port'));
            $('upnp_modify_oute_port_label').set('text', tl('w_Outer Port'));
            $('upnp_modify_confirm').set('text', tl('w_Confirm'));
            $('upnp_modify_cancel').set('text', tl('w_Cancel'));
            $('upnp_modify_enable_on_label').set('text', tl('w_on'));
            $('upnp_modify_enable_off_label').set('text', tl('w_off'));
        },

        render: function() {
            self.configManager.getConfig('UPnP', function(json_string) {
                UPnP = getTable(json_string);
                self._renderElements();
            });
        },

        bind: function() {
            $('upnp_default').addEvent('click', self._onDefaultClick);
            $('upnp_refresh').addEvent('click', self._onRefreshClick);
            $('upnp_confirm').addEvent('click', self._onConfirmClick);
            attachLimit('upnp_add_inner_port', 1, 65535);
            attachLimit('upnp_add_outer_port', 1, 65535);
            //修改弹出框
            modifyDialog = new Dialog('modify', self._onModifyItem, 'upnp_modify_confirm', 'upnp_modify_cancel', tl('w_Modify Mapping'));
            modifyDialog.setPosition(450, 100);

            $('upnp_help').addEvent('click', function() {
                openHelp('UPnPConfig.htm');
            });
            $('upnp_mode').addEvent('change', self._onModeChange);

            attachLimit('upnp_modify_inner_port', 1, 65535);
            attachLimit('upnp_modify_oute_port', 1, 65535);
        },

        /**
         * 根据UPNP模式重新创建表格头
         * @ignore
         */
        _tabListInit: function() {
            $('upnp_tableList_th').empty();
            if (isEnable('is_show_upnpMode')) {
                var htm = '<table cellpadding="0" cellspacing="0">';
                htm += '<tr>\
                            <th class="fn-widp10"></th>\
                            <th class="fn-widp20" id="upnp_service_name">服务名称</th>\
                            <th class="fn-widp15" id="upnp_protocol">协议</th>\
                            <th class="fn-widp15" id="upnp_inner_port">内部端口</th>\
                            <th class="fn-widp15" id="upnp_outer_port">外部端口</th>\
                            <th class="fn-widp15" id="upnp_mapState">映射状态</th>\
                            <th><span id="upnp_modify_item">修改</span></th>\
                        </tr>';
                htm += '</table>';
            } else {
                var htm = '<table cellpadding="0" cellspacing="0">';
                htm += '<tr>\
                        <th class="fn-widp10"></th>\
                        <th class="fn-widp20" id="upnp_service_name">服务名称</th>\
                        <th class="fn-widp15" id="upnp_protocol">协议</th>\
                        <th class="fn-widp15" id="upnp_inner_port">内部端口</th>\
                        <th class="fn-widp15" id="upnp_outer_port">外部端口</th>\
                        <th><span id="upnp_modify_item">修改</span></th>\
                    </tr>';
                htm += '</table>';
            }
            $('upnp_tableList_th').innerHTML = htm;
        },

        _onModeChange: function() {
            if ($('upnp_mode').value == 'Manual') {
                if (timeoutID) {
                    clearTimeout(timeoutID);
                    timeoutID = 0;
                }
                //$('upnp_add_item').removeEvents('click');
                //$('upnp_add_item').addEvent('click', self._onAddItemClick);
                //$('upnp_add_item').removeClass('ui-button-disabled');
                self._getUPnPStatus();
            } else {
                //$('upnp_add_item').removeEvents('click');
                //$('upnp_add_item').addClass('ui-button-disabled');
                self.configManager.getConfig('UPnP', function(json_string) {
                    if (JSON.decode(json_string).result) {
                        UPnP = getTable(json_string);
                        self._getUPnPStatus();
                    }
                });
            }
        },

        _getUPnPStatus: function() {
            self.netApp.getUPnPStatus(function(text, json) {
                var working = json.params.Working;
                $('upnp_status').setProperty('text', working ? tl('w_Mapping Succeed') : tl('w_Mapping Unkown'));

                if (isEnable('is_show_upnpMode')) {
                    PortMapStatusArray.empty();
                    var len = UPnP.MapTable.length;
                    if (working == false) {
                        for (var i = 0; i < len; i++) {
                            PortMapStatusArray.push(tl('w_Mapping Unkown'));
                        }
                    } else {
                        for (var i = 0; i < len; i++) {
                            if (json.params.PortMapStatus[i] == 'Success') {
                                PortMapStatusArray.push(tl('w_Mapping Succeed'));
                            } else if (json.params.PortMapStatus[i] == 'Failed') {
                                PortMapStatusArray.push(tl('w_Mapping Unkown'));
                            } else {
                                PortMapStatusArray.push(tl('w_Mapping Error'));
                            }
                        }
                    }
                }

                self._showMappingList();
            });
        },

        _renderElements: function() {
            $('upnp_enable').checked = UPnP.Enable;
            if (isEnable('is_show_startDeviceDiscover') && UPnP.StartDeviceDiscover != undefined) {
                $('upnp_discover').setStyle('display', '');
                $('upnp_discover_check').checked = UPnP.StartDeviceDiscover;
            } else {
                $('upnp_discover').setStyle('display', 'none');
            }
            if (isEnable('is_show_upnpMode') && UPnP.Mode) {
                $$('#upnp_mode_label,#upnp_mode').setStyle('display', '');
                $('upnp_mode').value = UPnP.Mode;
                /*if ($('upnp_mode').value == 'Manual') {
                    $('upnp_add_item').addEvent('click', self._onAddItemClick);
                    $('upnp_add_item').removeClass('ui-button-disabled');
                } else {
                    $('upnp_add_item').removeEvents('click');
                    $('upnp_add_item').addClass('ui-button-disabled');
                }*/
            } else {
                $$('#upnp_mode_label,#upnp_mode').setStyle('display', 'none')
            }
            self._getUPnPStatus();
            if (UPnP.Mode && isEnable('is_show_upnpMode')) {
                if (UPnP.Enable && UPnP.Mode == 'Auto') {
                    setTimeout(self._refreshMapStatus, 5000);
                }
            }
        },
        _refreshMapStatus: function() {
            if (!Site.currentPage.is['UPnPConfig']) {
                clearTimeout(timeoutID);
                timeoutID = 0;
                return;
            }
            self.configManager.getConfig('UPnP', function(json_string) {
                if (JSON.decode(json_string).result) {
                    UPnP = getTable(json_string);
                    self._getUPnPStatus();
                }

            });
            //timeoutID = setTimeout(self._refreshMapStatus, 5000);
        },
        _showMappingList: function() {
            var maps = UPnP.MapTable;
            if (isEnable('is_show_upnpMode')) {
                if (PortMapStatusArray.length == 0) {
                    for (var i = 0; i < UPnP.MapTable.length; i++) {
                        PortMapStatusArray.push(tl('w_Mapping Unkown'));
                    }
                }
            }
            if (maps) {
                var html = '<table cellpadding="0" cellspacing="0">';
                maps.each(function( map , i) {
                    if(map) {
                        var map = maps[i];
                        var checked = map.Enable ? "checked" : "";
                        var trClass = (i % 2) ? "" : "ui-table-tr-odd";
                        var serviceName = self._getDisplayServiceName(map);
                        html += '<tr id="' + 'upnp_item_' + i + '" class="upnp_item ' + trClass + '">';
                        if (isEnable('is_show_upnpMode')) {
                            html += '<td class="fn-widp10"><input class="upnp_item_enable" id="' + 'upnp_item_enable_' + i + '"  ' + checked + ' type="checkbox"/></td>';
                            html += '<td class="fn-widp20" data-service-name="' + map.ServiceName + '">' + serviceName + '</td>';
                            html += '<td class="fn-widp15">' + (map.ServiceType || map.ServiceName) + ':' + map.Protocol + '</td>';
                            html += '<td class="fn-widp15">' + map.InnerPort + '</td>';
                            html += '<td class="fn-widp15">' + map.OuterPort + '</td>';
                            html += '<td class="fn-widp15">' + PortMapStatusArray[i] + '</td>';
                        } else {
                            html += '<td class="fn-widp10"><input class="upnp_item_enable" id="' + 'upnp_item_enable_' + i + '"  ' + checked + ' type="checkbox"/></td>';
                            html += '<td class="fn-widp20">' + serviceName + '</td>';
                            html += '<td class="fn-widp15">' + map.Protocol + '</td>';
                            html += '<td class="fn-widp15">' + map.InnerPort + '</td>';
                            html += '<td class="fn-widp15">' + map.OuterPort + '</td>';
                        }

                        if (UPnP.Mode && isEnable('is_show_upnpMode')) {
                            if ($('upnp_mode').selectedIndex == 0) {
                                html += '<td class="fn-widp10"><i class="ui-table-icon-edit user_changeUserInfo"></i></td>';
                            } else {
                                html += '<td class="fn-widp10"><i class="ui-table-icon-edit ui-table-icon-edit-disabled user_changeUserInfo"></i></td>';
                            }
                        } else {
                            html += '<td class="fn-widp10"><i class="ui-table-icon-edit ui-table-icon-edit-disabled user_changeUserInfo" id="user_item_changeuser_0" style="cursor:pointer;"></i></td>';
                        }
                        html += '</tr>';
                    }
                });
                html += '</table>';
                $('upnp_list').innerHTML = html;

                // 绑定列表的事件
                $$('.upnp_item').addEvent('click', function() {
                    $$('.upnp_item').removeClass('ui-table-tr-current');
                    this.addClass('ui-table-tr-current');
                });
                $$('.upnp_item_enable').addEvent('click', function() {
                    var index = this.id.replace(/[^\d]/g, '');
                    UPnP.MapTable[index].Enable = this.checked;
                });
                //添加修改按钮的绑定事件
                $$('.user_changeUserInfo').addEvent('click', function() {
                    if(this.hasClass('ui-table-icon-edit-disabled')) {
                        return;
                    } else {
                        var index = this.getParent('tr').id.replace(/[^\d]/g, '');
                        self._changeUserInfo(index);
                    }
                });
            }
        },

        /**
         * 修改upnp弹出框
         * @ignore
         */
        _changeUserInfo: function(i) {
            var map = UPnP.MapTable[i];
            initModify = i;
            modifyDialog.show();
            if (map.Enable) {
                $('upnp_modify_enable_on').checked = true;
            } else {
                $('upnp_modify_enable_off').checked = true;
            }

            $('upnp_modify_inner_port').value = map.InnerPort;
            $('upnp_modify_oute_port').value = map.OuterPort;
            $('upnp_modify_protocol').value = map.Protocol;
            $('upnp_modify_inner_port').readOnly = false;
            if(map.ServiceName == 'WebService'){
                $('upnp_modify_inner_port').readOnly = true;
            }
        },

        /**
         * 修改upnp确定方法
         * @ignore
         */
        _onModifyItem: function() {
            //判断外部端口是否合理
            var map = {};
            map.Enable = $('upnp_modify_enable_on').checked;
            map.ServiceName = UPnP.MapTable[initModify].ServiceName;
            map.ServiceType = UPnP.MapTable[initModify].ServiceType;
            map.Protocol = $('upnp_modify_protocol').value;
            map.InnerPort = $('upnp_modify_inner_port').value - 0;
            map.OuterPort = $('upnp_modify_oute_port').value - 0;

            if (map.ServiceName == '' || map.InnerPort == '' || map.OuterPort == '') {
                remarkDisplay('upnp_remark', tl('Inputing is invalid'), 3000, 2);
                return;
            }

            //修改成功赋值保存
            UPnP.MapTable[initModify] = $merge(UPnP.MapTable[initModify], map)
            remarkDisplay('upnp_remark', tl('w_Operateingsuccess'), 3000, 0);

            $$('#upnp_item_' + initModify + ' td input')[0].checked = map.Enable;
            $$('#upnp_item_' + initModify + ' td')[1].innerHTML = self._getDisplayServiceName(map);
            $$('#upnp_item_' + initModify + ' td')[2].innerHTML = (map.ServiceType || map.ServiceName) + ':' + map.Protocol;
            $$('#upnp_item_' + initModify + ' td')[3].innerHTML = map.InnerPort;
            $$('#upnp_item_' + initModify + ' td')[4].innerHTML = map.OuterPort;

            modifyDialog.close();
        },

        _onRefreshClick: function() {
            if (timeoutID) {
                clearTimeout(timeoutID);
                timeoutID = 0;
            }
            self.configManager.getConfig('UPnP', function(json_string) {
                if (JSON.decode(json_string).result) {
                    UPnP = getTable(json_string);
                    if (!isEnable('is_show_upnpMode')) {
                        self._renderElements();
                    }
                    remarkDisplay('upnp_remark', tl('Operateingsuccess'), 3000, 0);
                } else {
                    remarkDisplay('upnp_remark', tl('Operateingfailure'), 3000, 1);
                    return;
                }
            }, false);

            if (isEnable('is_show_upnpMode')) {
                $('upnp_enable').checked = UPnP.Enable;
                $('upnp_mode').value = UPnP.Mode;
                /*if ($('upnp_mode').value == 'Manual') {
                    $('upnp_add_item').addEvent('click', self._onAddItemClick);
                    $('upnp_add_item').removeClass('ui-button-disabled');
                } else {
                    $('upnp_add_item').removeEvents('click');
                    $('upnp_add_item').addClass('ui-button-disabled');
                }*/
                if (UPnP.Enable) {
                    self.netApp.refreshUpnpRouter(function(jsonObj) {
                        if (JSON.decode(jsonObj).result) {
                            $$('#upnp_default,#upnp_refresh,#upnp_confirm').removeEvents().addClass('ui-button-disabled');
                            remarkDisplay('upnp_remark', tl('w_onfresh'), 5000, 0);
                            // 刷新路由需要大概3秒钟的时间，所以我们等5秒后去获取UPnP状态
                            setTimeout(function() {
                                $('upnp_default').addEvent('click', self._onDefaultClick).removeClass('ui-button-disabled');
                                $('upnp_refresh').addEvent('click', self._onRefreshClick).removeClass('ui-button-disabled');
                                $('upnp_confirm').addEvent('click', self._onConfirmClick).removeClass('ui-button-disabled');
                                self._getUPnPStatus();
                            }, 5000);
                        }
                    });
                } else {
                    $('upnp_status').setProperty('text', tl('w_Mapping Unkown'));
                    var len = PortMapStatusArray.length;
                    PortMapStatusArray = [];
                    for (var i = 0; i < len; i++) {
                        PortMapStatusArray.push(tl('w_Mapping Unkown'));
                    }
                    self._showMappingList();
                }
            }
        },

        _onConfirmClick: function() {
            if (timeoutID) {
                clearTimeout(timeoutID);
                timeoutID = 0;
            }
            UPnP.Enable = $('upnp_enable').checked;
            if (UPnP.Mode && isEnable('is_show_upnpMode')) {
                UPnP.Mode = $('upnp_mode').value;
            }
            if (isEnable('is_show_startDeviceDiscover') && UPnP.StartDeviceDiscover != undefined) {
                UPnP.StartDeviceDiscover = $('upnp_discover_check').checked;
            }
            self.configManager.setConfig('UPnP', UPnP, function(json_string) {
                if (JSON.decode(json_string).result) {
                    remarkDisplay('upnp_remark', tl('Succeed in saving configure'), 3000, 0);
                } else {
                    remarkDisplay('upnp_remark', tl('Saving failure'), 3000, 1);
                }
            });
            if (UPnP.Mode && isEnable('is_show_upnpMode')) {
                if (UPnP.Enable && UPnP.Mode == 'Auto') {
                    self._refreshMapStatus();
                }
            }
        },
        
        _onDefaultClick: function() {
            self.configManager.getDefault('UPnP', function(json_string) {
                if (JSON.decode(json_string).result) {
                    UPnP = getTable(json_string);
                    self._renderElements();
                    remarkDisplay('upnp_remark', tl('Defaultsuccess'), 3000, 0);
                } else {
                    remarkDisplay('upnp_remark', tl('Defaultfailure'), 3000, 1);
                }
            });
        },

        _getDisplayServiceName: function(map){
            var serviceName = '';
            // 当存在ServiceType时，且ServiceName也有值时，返回ServiceName
            // ServcieType是新加的，用来替代原来的ServiceName，这样就可以修改ServiceName了
            // 以后在有ServiceType的情况下，使用ServiceName作显示，为更好的兼容，在没有ServiceName
            // 的情况下，使用来原的方式来显示服务器名称
            if (map.ServiceType && map.ServiceName) return map.ServiceName;
            var serviceTpe = map.ServiceType || map.ServiceName;
            switch(serviceTpe){
                case 'WebService':
                    serviceName = 'HTTP';
                    break;
                case 'PrivService':
                    serviceName = map.Protocol;
                    break;
                case 'RTSPService':
                    serviceName = 'RTSP';
                    break;
                case 'HTTPSService':
                    serviceName = 'HTTPS';
                    break;
                case 'HTTPS':
                    serviceName = 'HTTPS';
                    break;
                default:
                    serviceName = 'Unkown';
                    break;
            }
            return serviceName;
        }
    }
})();