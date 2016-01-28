//LessonsCheck
mui.init();
(function($) {
	var btnArray = ['确认', '取消'];
	$('#OA_task_1').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function(e) {
			if (e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					$.swipeoutClose(li);
				}, 0);
			}
		});
	});
})(mui);
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var lesseoncheck = new lesseonCheck();
	if (action == 'new') {
		lesseoncheck.initNew();
		lesseoncheck.sendBtnTap();
	} else if (action == 'edit') {
		lesseoncheck.initEdit();
		lesseoncheck.sendBtnTap('edit');
	}
});

//厨房检查
function lesseonCheck() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	//	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&'; //KgId=33&KitchenCheckType=KitchenCheckType
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMPrepareLessonsCheck';
	this.updateurl = ' http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMPrepareLessonsCheck'; //{jsonstr}&jsonStr=''&&id='
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMKitchenCheckById&KitchenCheckId=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.datateacherlist = '';
	this.datateclasslist = '';
	this.creatLessonsCheckId = 0;
	//	this.prekitchencheckid = parseInt( plus.storage.getItem('prekitchencheckid'))
//	this.PrepareLessonsCheckId = parseInt(plus.storage.getItem('PrepareLessonsCheckId'))
	this.PrepareLessonsCheckId = 1;//临时
	this.teacherlist = document.getElementById('teacherslist');
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('OA_task_1')
	this.wating = '';
}
lesseonCheck.prototype.initNew = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetClassList();
	this.addBtnFn()
};
//页面打开时设置被选中的按钮的颜色 
lesseonCheck.prototype.initRadioParentBk = function() {
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
lesseonCheck.prototype.setTapRadioParentBK = function() {
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
lesseonCheck.prototype.ajaxGetTeacherList = function(editid) { //获取到的上次的修改人的id
	var self = this
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(this.teachersurl + 'KgId=' + self.kgid + '', {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				self.datateacherlist = data.RerurnValue
				self.addTeacherList(self.teacherlist, data.RerurnValue, editid)
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
lesseonCheck.prototype.addTeacherList = function(teacherlist, data, selectedvalue) {
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
	teacherlist.innerHTML += _html;
};
lesseonCheck.prototype.ajaxGetClassList = function() {
	var self = this
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.classlisturl + self.kgid, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				self.datateclasslist = data.RerurnValue
			}
		},
		error: function() {
			self.wating.close();
		}
	})
}

//添加检测项的方法
lesseonCheck.prototype.addBtnFn = function() {
	var self = this;
	self.addbtn.addEventListener('tap', function() {
		self.addOneClassCheck(self.datateclasslist, self.datateacherlist)
	}, false)
}


//添加检查项进入dome
lesseonCheck.prototype.addOneClassCheck = function(dataclass, datateacher, editdata) { //editdata获取编辑的返回data
	//	var _length = data.length;
	var _li = document.createElement('li');
	_li.setAttribute('class', 'mui-table-view-cell')
	var _html = "";
	_html += '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle"><table width="100%" class="tablestyle1">'
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
			_html += '</td><td width="35%"><input type="text" name="description' + i + '" value="' + editdata[i].Description + '"  class="bz_text"/><input  hidden="hidden"  name="DataDictionaryId"  value="' + data[i].DataDictionaryId + '" /></td></tr>';
		}
	} else {
		_html += '<tr>';
		_html += '<td width="15%"><select class="select_ClassInfoID">';
		for (i = 0; i < dataclass.length; i++) {
			_html += '<option value="' + dataclass[i].ClassInfoID + '"   >' + dataclass[i].ClassName + '</option>';
		}
		_html += '</select></td>';
		_html += '<td width="15%"><select class="select_LessonsTeacher" >';
		for (i = 0; i < datateacher.length; i++) {
			_html += '<option value="' + datateacher[i].WorkerExtensionId + '">' + datateacher[i].Name + '</option>';
		}
		_html += '</select></td>';
		_html += '	<td width="10%" class="select_IsPost"><select>';
		_html += '<option value="1">是</option>';
		_html += '<option value="0">否</option>';
		_html += '</select></td>';
		_html += '<td width="15%"><input type="text" class="mui-input input_Emphases"></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_HalfDayPlan "></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_Reflections"></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_GeneralComment"></td>';
		_html += '</tr>';
	}
	_html += '</table></div>'
	_li.innerHTML = _html
	this.checkbox.appendChild(_li)
};
//动态获取备课检查记录提交的数值
lesseonCheck.prototype.geSendArrValue = function() {
	var self = this;
	self.ClassInfoID = document.querySelectorAll('.select_ClassInfoID');
	self.LessonsTeacher = document.querySelectorAll('.select_LessonsTeacher');
	self.IsPost = document.querySelectorAll('.select_IsPost');
	self.Emphases = document.querySelectorAll('.input_Emphases');
	self.HalfDayPlan = document.querySelectorAll('.input_HalfDayPlan');
	self.Reflections = document.querySelectorAll('.input_Reflections');
	self.GeneralComment = document.querySelectorAll('.input_GeneralComment');
	var _length = self.ClassInfoID.length;
	var arrClassInfoID = getArrData(self.ClassInfoID);
	var arrTeacherId = getArrData(self.LessonsTeacher);
	var arrLessonsTeacher = getArrTeachers(self.LessonsTeacher);
	var arrIsPost = getArrData(self.IsPost);
	var arrEmphases = getArrData(self.Emphases);
	var arrHalfDayPlan = getArrData(self.HalfDayPlan);
	var arrReflections = getArrData(self.Reflections);
	var arrGeneralComment = getArrData(self.GeneralComment);
	var KMLessonsCheckDetailList = [];
	var examinatorId = self.teacherlist.value,
		examinatorName = self.teacherlist.options[self.teacherlist.selectedIndex].text;
	var _time = new Date();
	var nowtime = _time.Format("yyyy-MM-ddThh:mm:ss");
	var creatMES, examinatorMes, modifyMes;
	var sendjsonstr = '';

	function getArrData(data) {
		var _arr = [];
		for (i = 0; i < _length; i++) {
			_arr.push(data[i].value);
		}
		return _arr;
	};

	function getArrTeachers(data) {
		var _arr = [];
		for (i = 0; i < _length; i++) {
			_arr.push(data[i].options[data[i].selectedIndex].text)
		}
		return _arr
	}


	for (i = 0; i < _length; i++) {
		var _value = {
			"LessonsCheckDetailId": 0,
			"PrepareLessonsCheckId": 0,
			"ClassInfoID": arrClassInfoID[i],
			"TeacherId": arrTeacherId[i],
			"LessonsTeacher": arrLessonsTeacher[i],
			"IsPost": arrIsPost[i],
			"Emphases": arrEmphases[i],
			"HalfDayPlan": arrHalfDayPlan[i],
			"Reflections": arrReflections[i],
			"GeneralComment": arrGeneralComment[i]
		}
		KMLessonsCheckDetailList.push(_value)
	}

	KMLessonsCheckDetailList = JSON.stringify(KMLessonsCheckDetailList);

	var endstr1 = ',"PrepareLessonsCheckId":' + self.creatLessonsCheckId + ',"OrganizationId":' + self.kgid + ','
	creatMES = '"Creator":"' + self.userName + '","CreatorId":' + self.userId + ',"CreateDate":"' + nowtime + '",';
	examinatorMes = '"ExaminatorName":"' + examinatorName + '","ExaminatorId":' + examinatorId + ',"CheckDate":"' + nowtime + '",';
	modifyMes = '"Modifier":"","ModifyId":0,"ModifyDate":"' + nowtime + '"}';
	sendjsonstr = '{"KMLessonsCheckDetailList":' + KMLessonsCheckDetailList + ',"PrepareLessonsCheckId":' + self.creatLessonsCheckId + ',"OrganizationId":' + self.kgid + ',' + sendjsonstr + creatMES + examinatorMes + modifyMes;
	return sendjsonstr
}




//获取检查项的数据值
//lesseonCheck.prototype.geSendArrValue = function(editmes) {
//	var self = this;
//	var sendjsonstr = '';
//	var kMKitchenCheckDetailList = [];
//	var _tr = this.checktable.querySelectorAll('tr');
//	var _length = _tr.length;
//	var _KitchenCheckId;
//	if (!editmes) {
//		_KitchenCheckId = self.kitchencheckid;
//	} else {
//		_KitchenCheckId = self.prekitchencheckid;
//	}
//	for (i = 0; i < _length; i++) {
//		var _id = parseInt(_tr[i].querySelector('input[name="DataDictionaryId"]').value),
//			_result = parseInt(_tr[i].querySelector('input[type="radio"]:checked').value),
//			_description = _tr[i].querySelector('input[name="description' + i + '"]').value;
//		var _value = {
//			"KitchenCheckDetailId": _id,
//			"KitchenCheckId": _KitchenCheckId,
//			"KMItemId": _id,
//			"CheckResult": _result,
//			"Description": _description
//		};
//		kMKitchenCheckDetailList.push(_value);
//	}
//	kMKitchenCheckDetailList = JSON.stringify(kMKitchenCheckDetailList);
//	var examinatorId = self.teacherlist.value,
//		examinatorName = self.teacherlist.options[self.teacherlist.selectedIndex].text;
//	var _time = new Date();
//	var nowtime = _time.Format("yyyy-MM-ddThh:mm:ss");
//
//	var creatMES, examinatorMes, modifyMes;
//	if (!editmes) {
//		creatMES = '"Creator":"' + self.userName + '","CreatorId":' + self.userId + ',"CreateDate":"' + nowtime + '",';
//		examinatorMes = '"ExaminatorName":"' + examinatorName + '","ExaminatorId":' + examinatorId + ',"CheckDate":"' + nowtime + '",';
//		modifyMes = '"Modifier":"","ModifyId":0,"ModifyDate":"' + nowtime + '"}';
//	} else {
//		creatMES = '"Creator":"' + editmes.Creator + '","CreatorId":' + editmes.CreatorId + ',"CreateDate":"' + editmes.CreateDate + '",';
//		examinatorMes = '"ExaminatorName":"' + editmes.ExaminatorName + '","ExaminatorId":' + editmes.ExaminatorId + ',"CheckDate":"' + editmes.CheckDate + '",';
//		modifyMes = '"Modifier":"' + examinatorName + '","ModifyId":' + examinatorId + ',"ModifyDate":"' + nowtime + '"}';
//	}
//	sendjsonstr = '{"kMKitchenCheckDetailList":' + kMKitchenCheckDetailList + ',"KitchenCheckId":' + _KitchenCheckId + ',"OrganizationId":' + self.kgid + ',' + sendjsonstr + creatMES + examinatorMes + modifyMes;
//	return sendjsonstr;
//};
//检查提交事件
lesseonCheck.prototype.sendBtnTap = function(edit) {
	var self = this;
	self.senbtn.addEventListener('tap', function() {
		if (edit == "edit") {
			self.ajaxSendCheckMES(self.editMes);
		} else {
			self.ajaxSendCheckMES();
//			self.geSendArrValue()
		}
	}, false);
};
lesseonCheck.prototype.ajaxSendCheckMES = function(editMES) {
	var self = this;
	var examinatorId = self.teacherlist.value;
	if (!examinatorId) {
		mui.alert("请选择检查人", "提示");
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
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id: self.PrepareLessonsCheckId
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			alert(data.Success)
			if (data.Success == 10000) {
				alert(num)
				var num = (data.RerurnValue).toString();
				plus.storage.setItem('PrepareLessonsCheckId', (data.RerurnValue).toString());
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
lesseonCheck.prototype.initEdit = function() {
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
lesseonCheck.prototype.ajaxGetEditMes = function() {
	var self = this;
	if (!self.prekitchencheckid) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + '1', {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			alert(data.Success)
			if (data.Success == 10000) {
				self.ajaxGetTeacherList(data.RerurnValue.ExaminatorId); //测试API 这里是空 所以这里报错了
				//				self.ajaxGetChecklist(data.RerurnValue.kMKitchenCheckDetailList);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};