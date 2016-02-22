//var TEACHERSURL = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&' //KgId=33&modifyTime=2015-01-01
mui.init();

mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var kitchencheck = new kitchenCheck();
	if (action == 'new') {
		kitchencheck.initNew();
		kitchencheck.sendBtnTap();
	} else if (action == 'edit') {
		kitchencheck.initEdit();
		kitchencheck.sendBtnTap('edit');
	}
});

//厨房检查
function kitchenCheck() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&KitchenCheckType=KMKitchenCheckTypeItem&'; //KgId=33&KitchenCheckType=KitchenCheckType
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=SaveKMKitchenCheck'; //{jsonstr}
	this.updateurl='http://115.28.141.223:89/WebServices/KMService.ashx?Option=SaveKMKitchenCheck';//
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMKitchenCheckById&KitchenCheckId=';
	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_3_1_id = parseInt( plus.storage.getItem('key_3_1_id'))
	this.teacherlist = document.getElementById('teacherslist');
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.wating = '';
}
kitchenCheck.prototype.initNew = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetChecklist();
};
//页面打开时设置被选中的按钮的颜色 
kitchenCheck.prototype.initRadioParentBk = function() {
	this.radioinput = document.querySelectorAll('input[type="radio"]');
	this.radiosspan = document.querySelectorAll('.radio_span');
	for (i = 0; i < this.radioinput.length; i++) {
		if (this.radioinput[i].checked === true) {
			this.radioinput[i].parentElement.style.background = '#F0AD4E';
		} else {
			this.radioinput[i].parentElement.style.background = 'none';
		}
	}
};
//点击时修改背景色的方法
kitchenCheck.prototype.setTapRadioParentBK = function() {
	var self = this;
	for (i = 0; i < self.radioinput.length; i++) {
		self.radioinput[i].addEventListener('change', function() {
			var _name = this.getAttribute('name');
			var _name_input = document.querySelectorAll('input[name="' + _name + '"]');
			seBK(_name_input);
		}, false);
	}

	function seBK(nameinput) {
		for (i = 0; i < nameinput.length; i++) {
			if (nameinput[i].checked == true) {
				nameinput[i].parentElement.style.background = '#F0AD4E';
			} else {
				nameinput[i].parentElement.style.background = 'none';
			}
		}
	};
};
kitchenCheck.prototype.ajaxGetTeacherList = function(editid) { //获取到的上次的修改人的id
	var self = this
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(this.teachersurl + 'KgId=' + this.kgid + '', {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('teacherlist',JSON.stringify(data.RerurnValue))
				self.addTeacherList(data.RerurnValue, editid)
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
kitchenCheck.prototype.addTeacherList = function( data, selectedvalue) {
	var _length = data.length;
	var _html;
	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].WorkerExtensionId + '" >' + data[i].Name + '</option>';
		} else {
			if (data[i].WorkerExtensionId == selectedvalue) {
				_html += '<option value="' + data[i].WorkerExtensionId + '" selected>' + data[i].Name + '</option>';
			} else {
				_html += '<option value="' + data[i].WorkerExtensionId + '" >' + data[i].Name + '</option>';
			}
		}
	}
	this.teacherlist.innerHTML += _html;
};


//添加检测项的方法
kitchenCheck.prototype.ajaxGetChecklist = function(editdata) {
	var self = this;
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(this.checklisturl + 'KgId=' + this.kgid , {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				self.addCheckList(data.RerurnValue, editdata);
				//添加背景色的事件
				self.initRadioParentBk();
				//添加背景色的点击处理事件
				self.setTapRadioParentBK();

			}
		},
		error: function() {
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};
//添加检查项进入dome
kitchenCheck.prototype.addCheckList = function(data, editdata) { //editdata获取编辑的返回data
	var _length = data.length;
	var _html = "";
	if (editdata) {
		for (i = 0; i < _length; i++) {
			_html += '<tr><td width="25%">' + data[i].DataDictionaryName + '</td><td width="20%">';
			if (editdata[i].CheckResult == 1) {
				_html += '<label><span class="radio_span"><input type="radio" hidden="hidden" checked="checked" name="CheckResult' + i + '" value="1" />合格</span></label>';
				_html += '</td><td width="20%"><label><span class="radio_span"><input type="radio" hidden="hidden" name="CheckResult' + i + '" value="0" />不合格</span></label>';
			} else {
				_html += '<label><span class="radio_span"><input type="radio" hidden="hidden"  name="CheckResult' + i + '" value="1" />合格</span></label>';
				_html += '</td><td width="20%"><label><span class="radio_span"><input type="radio" checked="checked" hidden="hidden" name="CheckResult' + i + '" value="0" />不合格</span></label>';
			}
			_html += '</td><td width="35%"><input type="text" name="description' + i + '" value="' + editdata[i].Description + '"  class="bz_text"/><input  hidden="hidden"  name="DataDictionaryId"  value="' + editdata[i].KMItemId + '" /><input  hidden="hidden"  name="KitchenCheckDetailId"  value="' + editdata[i].KitchenCheckDetailId + '" /></td></tr>';
		}
	} else {
		for (i = 0; i < _length; i++) {
			_html += '<tr><td width="25%">' + data[i].DataDictionaryName + '</td><td width="20%">';
			_html += '<label><span class="radio_span"><input type="radio" hidden="hidden" checked="checked" name="CheckResult' + i + '" value="1" />合格</span></label>';
			_html += '</td><td width="20%"><label><span class="radio_span"><input type="radio" hidden="hidden" name="CheckResult' + i + '" value="0" />不合格</span></label>';
			_html += '</td><td width="35%"><input type="text" name="description' + i + '" value=""  class="bz_text"/><input  hidden="hidden"  name="DataDictionaryId"  value="' + data[i].DataDictionaryId + '" /><input  hidden="hidden"  name="KitchenCheckDetailId"  value="0" /></td></tr>';
		}
	}


	this.checktable.innerHTML += _html;
};
//获取检查项的数据值
kitchenCheck.prototype.geSendArrValue = function(editmes) {
	var self = this;
	var sendjsonstr = '';
	var kMKitchenCheckDetailList = [];
	var _tr = this.checktable.querySelectorAll('tr');
	var _length = _tr.length;
	var _KitchenCheckId;
	if (!editmes) {
		_KitchenCheckId = 0;
	} else {
		_KitchenCheckId = self.key_3_1_id;
	}
	for (i = 0; i < _length; i++) {
		var _KitchenCheckDetailId = 0,
			_result = parseInt(_tr[i].querySelector('input[type="radio"]:checked').value),
			_KMItemId=parseInt(_tr[i].querySelector('input[name="DataDictionaryId"]').value),
			_description = _tr[i].querySelector('input[name="description' + i + '"]').value;
		if(editmes){
			 _KitchenCheckDetailId =_tr[i].querySelector('input[name="KitchenCheckDetailId"]').value;
		}
		var _value = {
			"KitchenCheckDetailId": _KitchenCheckDetailId,
			"KitchenCheckId": _KitchenCheckId,
			"KMItemId": _KMItemId,
			"CheckResult": _result,
			"Description": _description
		};
		kMKitchenCheckDetailList.push(_value);
	}
	kMKitchenCheckDetailList = JSON.stringify(kMKitchenCheckDetailList);
	var examinatorId = self.teacherlist.value,
		examinatorName = self.teacherlist.options[self.teacherlist.selectedIndex].text;
	var _time = new Date();
	var nowtime = _time.Format("yyyy-MM-ddThh:mm:ss");

	var creatMES, examinatorMes, modifyMes;
	if (!editmes) {
		creatMES = '"Creator":"' + self.userName + '","CreatorId":' + self.userId + ',"CreateDate":"' + nowtime + '",';
		examinatorMes = '"ExaminatorName":"' + examinatorName + '","ExaminatorId":' + examinatorId + ',"CheckDate":"' + nowtime + '",';
		modifyMes = '"Modifier":"","ModifyId":0,"ModifyDate":"' + nowtime + '"}';
	} else {
		creatMES = '"Creator":"' + editmes.Creator + '","CreatorId":' + editmes.CreatorId + ',"CreateDate":"' + editmes.CreateDate + '",';
		examinatorMes = '"ExaminatorName":"' + editmes.ExaminatorName + '","ExaminatorId":' + editmes.ExaminatorId + ',"CheckDate":"' + editmes.CheckDate + '",';
		modifyMes = '"Modifier":"' + examinatorName + '","ModifyId":' + examinatorId + ',"ModifyDate":"' + nowtime + '"}';
	}
	sendjsonstr = '{"kMKitchenCheckDetailList":' + kMKitchenCheckDetailList + ',"KitchenCheckId":' + _KitchenCheckId + ',"OrganizationId":' + self.kgid + ',' + sendjsonstr + creatMES + examinatorMes + modifyMes;
	return sendjsonstr;
};
//检查提交事件
kitchenCheck.prototype.sendBtnTap = function(edit) {
	var self = this;
	self.senbtn.addEventListener('tap', function() {
		if (edit == "edit") {
			self.ajaxSendCheckMES(self.editMes);
		} else {
			self.ajaxSendCheckMES();
		}
	}, false);
};
kitchenCheck.prototype.ajaxSendCheckMES = function(editMES) {
	var self = this;
	var examinatorId = self.teacherlist.value;
	if (!examinatorId) {
		mui.alert("请选择检查人", "提示");
		return;
	}
	var _sendData,_sendurl;
	if (editMES) {
		_sendurl=self.updateurl;
		_sendData = self.geSendArrValue(editMES);
	} else {
		_sendurl=self.createurl;
		_sendData = self.geSendArrValue();
	}
	 console.log(_sendData)
	self.wating = plus.nativeUI.showWaiting();
         
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			alert(data.Success)
			if (data.Success == 10000) {
				var num = (data.RerurnValue).toString();
				plus.storage.setItem('key_3_1_id', (data.RerurnValue).toString());
				mui.alert('提交成功！', '提示', function() {
					mui.back();
				});
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('提交失败！', '提示');
		}
	});
};

///////edit
kitchenCheck.prototype.initEdit = function() {
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
kitchenCheck.prototype.ajaxGetEditMes = function() {
	var self = this;
	if (!self.key_3_1_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_3_1_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				self.ajaxGetTeacherList(data.RerurnValue.ExaminatorId);//测试API 这里是空 所以这里报错了
				self.ajaxGetChecklist(data.RerurnValue.kMKitchenCheckDetailList);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};