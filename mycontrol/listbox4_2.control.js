//4_2
mui.init();
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var hinterview = new homeInterview();
	if (action == 'new') {
		hinterview.initNew();
		hinterview.sendBtnTap();
	} else if (action == 'edit') {
		hinterview.initEdit();
		hinterview.sendBtnTap('edit');
	}
});

//校车行政
function homeInterview() {
	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	//	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&'; //KgId=33&KitchenCheckType=KitchenCheckType
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMSchoolBusAdminCheck'; //&jsonStr=''  
	this.updateurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMSchoolBusAdminCheck'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMSchoolBusAdminCheckById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33
	this.schoolbuslisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMSchoolBusRegisterInfoListByOrg&Id=' + this.kgid
	this.buslinelisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMSchoolBusPickupInfoListByOrg&Id=' + this.kgid
	this.busservicepersonListurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMCarServicePersonListByBusId&id=' //随车司机人员列表
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_4_2_id = parseInt(plus.storage.getItem('key_4_2_id')) || 0;
	this.teacherlist = document.getElementById('teacherslist');
	this.classlist = document.getElementById('selectclass');
	this.checktime = document.getElementById('checktime');
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'));
	this.databuslist = JSON.parse(plus.storage.getItem('buslist'));
	this.databusline = JSON.parse(plus.storage.getItem('busline'));
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'));
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('homeInterviewtab')
	this.wating = '';

	//非公共性的dome id
	this.ChildCount = document.getElementById('ChildCount');
	this.PlateNumber = document.getElementById('PlateNumber');
	this.LineNumber = document.getElementById('LineNumber');
	this.Driver = document.getElementById('Driver');
	this.Buser1 = document.getElementById('Buser1');
	this.Buser2 = document.getElementById('Buser2');
	this.StartupTime = document.getElementById('StartupTime');
	this.ReturnTime = document.getElementById('ReturnTime');
	this.DetailsInformation = document.getElementById('DetailsInformation')
	this.MakeBetterInfo = document.getElementById('MakeBetterInfo');
	this.CarryoutInfo = document.getElementById('CarryoutInfo');
}
var P_type = homeInterview.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	this.addTeacherList(this.datateacherlist)
	this.ajxGetBusPlateNumber();
	this.addBusPlateNumber(this.databuslist)
	this.ajaxGetBusLineList()
	this.addBusLineList(this.databusline)

	this.setCheckDate()
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
					self.addTeacherList(data.RerurnValue, editid)
				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
P_type.addTeacherList = function(data, selectedvalue) {
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
	this.teacherlist.innerHTML += _html;
};
P_type.ajxGetBusPlateNumber = function(editid) {
	var self = this;
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(self.schoolbuslisturl, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('buslist', JSON.stringify(data.RerurnValue))
				if (!self.databuslist) {
					self.databuslist = data.RerurnValue
					self.addBusPlateNumber(data.RerurnValue, editid)
				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取车牌列表失败，请检查网络", '提示')
		}
	});
};
P_type.addBusPlateNumber = function(data, selectedvalue) {
	if (!data) {
		return
	}
	var self = this
	var _length = data.length;
	var _html = "";
	for (var i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].BusId + '">' + data[i].LicensePlate + '</option>'
		} else {
			if (selectedvalue == data[i].BusId) {
				_html += '<option value="' + data[i].BusId + '" selected="selected">' + data[i].LicensePlate + '</option>';
			} else {
				_html += '<option value="' + data[i].BusId + '">' + data[i].LicensePlate + '</option>';
			}
		}
	}
	self.PlateNumber.innerHTML += _html
	self.busPlateNumberChangeFn()


};

P_type.ajaxGetBusLineList = function(editid) { //获取到的上次的修改人的id
	var self = this
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(this.buslinelisturl, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('busline', JSON.stringify(data.RerurnValue))
				if (!self.databusline) {
					self.databusline = data.RerurnValue
					self.addBusLineList(data.RerurnValue, editid)
				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
P_type.addBusLineList = function(data, selectedvalue) {
	if (!data) {
		return
	}
	var self = this
	var _length = data.length;
	var _html = "";

	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].LineNumber + '" >' + data[i].LineNumber + '</option>';
		} else {
			if (data[i].LineNumber == selectedvalue) {
				_html += '<option value="' + data[i].LineNumber + '" selected>' + data[i].LineNumber + '</option>';
			} else {
				_html += '<option value="' + data[i].LineNumber + '" >' + data[i].LineNumber + '</option>';
			}
		}
	}
	self.LineNumber.innerHTML += _html;
};
P_type.busPlateNumberChangeFn = function(data) {
		var self = this
		self.PlateNumber.addEventListener('change', function() {
			if (this.value == 0) {
				self.Driver.value = ""
				self.Buser1.value = ""
				self.Buser1.setAttribute('data-person-id', 0)
				self.Buser2.value = ""
				self.Buser2.setAttribute('data-person-id', 0)
				return
			}
			self.ajaxGetBusServicePersonList(this.value)
		})
	}
	//获取列表
P_type.ajaxGetBusServicePersonList = function(id) {
	var self=this
		self.wating = plus.nativeUI.showWaiting()
		mui.ajax(self.busservicepersonListurl + id, {
			dataType: 'json',
			type: 'get',
			timeout: '5000',
			success: function(data) {
				self.wating.close()
				if (data.Success == 10000) {
					self.addGetBusServicePersonList(data.RerurnValue)
				}
			},
			error: function() {
				self.wating.close()
				mui.alert("提示", "获取随车人员信息失败。")
			}
		})
	}
	//插入dome数据
P_type.addGetBusServicePersonList = function(data) {
	var self=this
	self.Buser1.value = ""
	self.Buser1.setAttribute('data-person-id', 0)
	self.Buser2.value = ""
	self.Buser2.setAttribute('data-person-id', 0)
	for (var i = 0; i < data.length; i++) {
		if (data[i].ServiceTypeId == 1) {
			self.Driver.value = data[i].WorkerName
			self.Driver.setAttribute('data-person-id', data[i].WorkerExtensionId)
		} else if (data[i].ServiceTypeId == 2) {
			if (i == 1) {
				self.Buser1.value = data[i].WorkerName;
				self.Buser1.setAttribute('data-person-id', data[i].WorkerExtensionId);
			} else if (i == 2) {
				self.Buser2.value = data[i].WorkerName;
				self.Buser2.setAttribute('data-person-id', data[i].WorkerExtensionId);
			}
		}
	}
}


//设置检查的默认时间
P_type.setCheckDate = function(checkdate) {
	if (checkdate) {
		this.checktime.value = checkdate
		this.checktime.setAttribute('readonly', 'readonly');
		return
	}
	var nowtime = new Date();
	nowtime = nowtime.Format("yyyy-MM-ddThh:mm:ss");
	this.checktime.value = nowtime;
	//给出发返回添加默认时间
	this.StartupTime.value = nowtime;
	this.ReturnTime.value = nowtime;

};

P_type.addPreKMSchoolBusData = function(data) {
	var self = this;
	self.ChildCount.value = data.ChildCount;
	self.ajaxGetBusServicePersonList(data.BusId);
	self.StartupTime.value = data.StartupTime;
	self.ReturnTime.value = data.ReturnTime;
	self.DetailsInformation.value = data.DetailsInformation;
	self.MakeBetterInfo.value = data.MakeBetterInfo;
	self.CarryoutInfo.value = data.CarryoutInfo;


}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm:ss");


	var _Checker = self.teacherlist.options[self.teacherlist.selectedIndex].text,
		_CheckPersonId = parseInt(self.teacherlist.value),
		_CheckDate = self.checktime.value,
		_ChildCount = parseInt(self.ChildCount.value),
		_LineNumber = self.LineNumber.value,
		_PlateNumber = self.PlateNumber.options[self.PlateNumber.selectedIndex].text,
		_BusId = parseInt(self.PlateNumber.value),
		_Driver = parseInt(self.Driver.getAttribute('data-person-id')),
		_Buser1 = self.Buser1.value,
		_BuserId1 = parseInt(self.Buser1.getAttribute('data-person-id')),
		_Buser2 = self.Buser2.value,
		_BuserId2 = parseInt(self.Buser2.getAttribute('data-person-id')),
		_StartupTime = self.StartupTime.value,
		_ReturnTime = self.ReturnTime.value,
		_DetailsInformation = self.DetailsInformation.value,
		_MakeBetterInfo = self.MakeBetterInfo.value,
		_CarryoutInfo = self.CarryoutInfo.value,
		_CheckId = 0;
	if (editdata) {
		_CheckId = editdata.CheckId;
	}

	//理论上讲 创建时间与检查时间都应该是首次创建该项的时间修改时间保持当前时间状态 

	return {
		"CheckId": _CheckId,
		"OrganizationId": self.kgid,
		"LineNumber": _LineNumber,
		"BusId": _BusId,
		"PlateNumber": _PlateNumber,
		"CheckDate": _CheckDate,
		"Driver": _Driver,
		"BuserId1": _BuserId1,
		"Buser1": _Buser1,
		"BuserId2": _BuserId2,
		"Buser2": _Buser2,
		"ChildCount": _ChildCount,
		"StartupTime": _StartupTime,
		"ReturnTime": _ReturnTime,
		"CheckPersonId": _CheckPersonId,
		"Checker": _Checker,
		"DetailsInformation": _DetailsInformation,
		"MakeBetterInfo": _MakeBetterInfo,
		"CarryoutInfo": _CarryoutInfo,
		"CreatorId": self.userId,
		"Creator": self.userName,
		"CreateDate": _CheckDate,
		"ModifierId": self.userId,
		"ModifyDate": _nowtime,
		"Modifier": self.userName
	}
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
	if (!self.teacherlist.value) {
		mui.alert("请选择检查人", "提示");
		return;
	}
	if (!self.ChildCount.value) {
		mui.alert("请添加幼儿人数", "提示");
		return;
	}
	if (!self.LineNumber.value) {
		mui.alert("请选择线路", "提示");
		return;
	}
	if (!self.PlateNumber.value) {
		mui.alert("请选择车牌", "提示");
		return;
	}

	var _sendData, _sendurl;
	if (editMES) {
		_sendurl = self.updateurl;
		_sendData = self.geSendArrValue(editMES);
	} else {
		_sendurl = self.createurl;
		_sendData = self.geSendArrValue();
	}
	var _id = _sendData.CheckId;
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
					plus.storage.setItem('key_4_2_id', (data.RerurnValue).toString());
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
	if (!self.key_4_2_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}

	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_4_2_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				console.log(JSON.stringify(data.RerurnValue))
				self.addTeacherList(self.datateacherlist, data.RerurnValue.CheckPersonId);
				self.addBusLineList(self.databusline, data.RerurnValue.LineNumber);
				self.addBusPlateNumber(self.databuslist, data.RerurnValue.BusId);
				self.setCheckDate(data.RerurnValue.CheckDate)
				self.addPreKMSchoolBusData(data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};