//LessonsCheck
mui.init();
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var systempage = new systemPage();
	if (action == 'new') {
		systempage.initNew();
		systempage.sendBtnTap();
	} else if (action == 'edit') {
		systempage.initEdit();
		systempage.sendBtnTap('edit');
	}
});

//厨房检查
function systemPage() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMHandoverRecord'; //&jsonStr=''  
	this.updateurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMHandoverRecord'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMHandoverRecordById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_2__3_id = parseInt(plus.storage.getItem('key_2__3_id')) || 0;
	this.teacherlist = document.getElementById('teacherslist');
	this.classlist = document.getElementById('selectclass');
	this.checktime = document.getElementById('checktime')
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'))
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'))
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('systemPagetab')
	this.wating = '';

	//非公共性的dome id

	this.ToBeNumber = document.getElementById('ToBeNumber');
	this.ToNumber = document.getElementById('ToNumber');
	this.PersonnelList = document.getElementById('PersonnelList');
	this.GoodsName = document.getElementById('GoodsName');
	this.ChildSituation = document.getElementById('ChildSituation');
	this.SleepSituation = document.getElementById('SleepSituation');
	this.DayTeacher = document.getElementById('DayTeacher');
	this.AllTeacher = document.getElementById('AllTeacher');
	this.NightTeacher = document.getElementById('NightTeacher');
	this.HandoverTime = document.getElementById('HandoverTime');
	this.RecordDate = document.getElementById('RecordDate')
}
var P_type = systemPage.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	//	this.addTeacherList(this.datateacherlist)
	this.addTeacherList(this.datateacherlist, this.DayTeacher)
	this.addTeacherList(this.datateacherlist, this.AllTeacher)
	this.addTeacherList(this.datateacherlist, this.NightTeacher)

	this.ajaxGetClassList();
	this.addClassList(this.dataclasslist)
	this.setCheckDate(this.HandoverTime)
	this.setCheckDate(this.RecordDate)
};
//页面打开时设置被选中的按钮的颜色 
P_type.initRadioParentBk = function() {
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
P_type.ajaxGetTeacherList = function(editid) { //获取到的上次的修改人的id
	var self = this
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(this.teachersurl + 'KgId=' + self.kgid + '', {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('teacherlist', JSON.stringify(data.RerurnValue))
				if (!self.datateacherlist) {
					self.datateacherlist = data.RerurnValue
					self.addTeacherList(data.RerurnValue, self.AllTeacher, editid)
					self.addTeacherList(data.RerurnValue, self.NightTeacher, editid)
					self.addTeacherList(data.RerurnValue, self.HandoverTime, editid)

				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
P_type.addTeacherList = function(data, selectelement, selectedvalue) {
	if (!data) {
		return
	}
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
	selectelement.innerHTML += _html;
};
P_type.ajaxGetClassList = function() {
	var self = this
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.classlisturl + self.kgid, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				plus.storage.setItem('classlist', JSON.stringify(data.RerurnValue))
				self.dataclasslist = data.RerurnValue
				self.addClassList(data.RerurnValue)
			}
		},
		error: function() {
			self.wating.close();
		}
	})
};
P_type.addClassList = function(data, selectedvalue) {
	if (!data) {
		return
	}
	var _length = data.length;
	var _html;
	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].ClassInfoID + '" >' + data[i].ClassName + '</option>';
		} else {
			if (data[i].ClassInfoID == selectedvalue) {
				_html += '<option value="' + data[i].ClassInfoID + '" selected="selected">' + data[i].ClassName + '</option>';
			} else {
				_html += '<option value="' + data[i].ClassInfoID + '" >' + data[i].ClassName + '</option>';
			}
		}
	}
	this.classlist.innerHTML += _html;
};
//设置检查的默认时间
P_type.setCheckDate = function(timeelement, checkdate) {
	if (checkdate) {
		timeelement.value = checkdate
		timeelement.setAttribute('readonly', 'readonly')
		return
	}
	var nowtime = new Date()
	nowtime = nowtime.Format("yyyy-MM-ddThh:mm")
	timeelement.value = nowtime
};

P_type.addPreKMHandoverRecordData = function(data) {
	var self = this;
	self.ToBeNumber.value = data.ToBeNumber;
	self.ToNumber.value = data.ToNumber;
	self.PersonnelList.value = data.PersonnelList;
	self.GoodsName.value = data.GoodsName;
	self.ChildSituation.value = data.ChildSituation;
	self.SleepSituation.innerText = data.SleepSituation;
	
	self.RecordDate.value=data.RecordDate
	self.HandoverTime.value=data.HandoverTime
}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm");
	var _DayTeacher = self.DayTeacher.options[self.DayTeacher.selectedIndex].text,
		_DayTeacherId = parseInt(self.DayTeacher.value),
		_AllTeacher = self.AllTeacher.options[self.AllTeacher.selectedIndex].text,
		_AllTeacherId = parseInt(self.AllTeacher.value),
		_NightTeacher = self.NightTeacher.options[self.NightTeacher.selectedIndex].text,
		_NightTeacherId = parseInt(self.NightTeacher.value),
		_ClassInfoID = parseInt(self.classlist.value),
		_ClassName = self.classlist.options[self.classlist.selectedIndex].text,
		_ToBeNumber = parseInt(self.ToBeNumber.value),
		_ToNumber = parseInt(self.ToNumber.value),
		_PersonnelList = self.PersonnelList.value,
		_GoodsName = self.GoodsName.value,
		_ChildSituation = self.ChildSituation.value,
		_SleepSituation = self.SleepSituation.value,
		_RecordDate = self.RecordDate.value,
		_HandoverTime = self.HandoverTime.value,
		_CreateDate = _nowtime,
		_HandoverRecordId = 0;

	if (editdata) {
		_HandoverRecordId = editdata.HandoverRecordId;
		_CreateDate = editdata.CreateDate;
	}
	//理论上讲 创建时间与检查时间都应该是首次创建该项的时间修改时间保持当前时间状态 

	return {
		"HandoverRecordId": _HandoverRecordId,
		"DayTeacher": _DayTeacher,
		"DayTeacherId": _DayTeacherId,
		"AllTeacher": _AllTeacher,
		"AllTeacherId": _AllTeacherId,
		"NightTeacher": _NightTeacher,
		"NightTeacherId": _NightTeacherId,
		"ClassInfoID": _ClassInfoID,
		"ClassName": _ClassName,
		"ToBeNumber": _ToBeNumber,
		"ToNumber": _ToNumber,
		"PersonnelList": _PersonnelList,
		"GoodsName": _GoodsName,
		"ChildSituation": _ChildSituation,
		"SleepSituation": _SleepSituation,
		"RecordDate": _RecordDate,
		"HandoverTime": _HandoverTime,
		"State": 1,
		"OrganizationId": self.kgid,
		"CreatorId": self.userId,
		"Creator": self.userName,
		"CreateDate": _CreateDate,
		"ModifyId": self.userId,
		"ModifyDate": _nowtime,
		"Modifier": self.userName
	}
	//	return sendjsonstr
}

//检查提交事件
P_type.sendBtnTap = function(edit) {
	var self = this;
	self.senbtn.addEventListener('tap', function() {
		if (edit == "edit") {
			self.ajaxSendCheckMES(self.editMes);
		} else {
			self.ajaxSendCheckMES();
		}
	}, false);
};
//ajax提交检查信息
P_type.ajaxSendCheckMES = function(editMES) {
	var self = this;
	//	var examinatorId = self.teacherlist.value;
	//	if (!examinatorId) {
	//		mui.alert("请选择检查人", "提示");
	//		return;
	//	}
	var _sendData, _sendurl;
	if (editMES) {
		_sendurl = self.updateurl;
		_sendData = self.geSendArrValue(editMES);
	} else {
		_sendurl = self.createurl;
		_sendData = self.geSendArrValue();
	}
	var _id = _sendData.HandoverRecordId
	_sendData = (JSON.stringify(_sendData))
	console.log(_sendData)
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id: _id
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				mui.alert('提交成功！', '提示', function() {
					plus.storage.setItem('key_2__3_id', (data.RerurnValue).toString());
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
P_type.initEdit = function() {
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
P_type.ajaxGetEditMes = function() {
	var self = this;
	if (!self.key_2__3_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}

	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_2__3_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				console.log(JSON.stringify(data.RerurnValue))
				self.addTeacherList(self.datateacherlist, self.DayTeacher, data.RerurnValue.DayTeacherId)
				self.addTeacherList(self.datateacherlist, self.AllTeacher, data.RerurnValue.AllTeacherId)
				self.addTeacherList(self.datateacherlist, self.NightTeacher, data.RerurnValue.NightTeacherId)
				self.addClassList(self.dataclasslist, data.RerurnValue.ClassInfoID)
				self.addPreKMHandoverRecordData(data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};