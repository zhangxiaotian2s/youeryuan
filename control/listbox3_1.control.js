//var TEACHERSURL = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&' //KgId=33&modifyTime=2015-01-01
mui.init()
	//var  kitchencheck
mui.plusReady(function() {
	//	KgId = JSON.parse(plus.storage.getItem('userMes')).KgId
	//	ajaxGetTeachers()
	kitchencheck = new kitchenCheck()
	kitchencheck.init();
	//点击保存事件
	kitchencheck.sendBtnTap()
})

//厨房检查
function kitchenCheck() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&' //KgId=33&modifyTime=2015-01-01
	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&' //KgId=33&KitchenCheckType=KitchenCheckType
	this.sendurl = ' http://115.28.141.223:89/WebServices/KMService.ashx?Option=SaveKMKitchenCheck&jsonStr=' //{jsonstr}
	this.userMes = JSON.parse(plus.storage.getItem('userMes'))
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.kitchencheckid = 0
	this.teacherlist = document.getElementById('teacherslist');
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn')

}
kitchenCheck.prototype.init = function() {
		this.ajaxGetTeacherList()
		this.ajaxGetChecklist()
	}
	//页面打开时设置被选中的按钮的颜色 
kitchenCheck.prototype.initRadioParentBk = function() {
		this.radioinput = document.querySelectorAll('input[type="radio"]')
		this.radiosspan = document.querySelectorAll('.radio_span');
		for (i = 0; i < this.radioinput.length; i++) {
			if (this.radioinput[i].checked == true) {
				this.radioinput[i].parentElement.style.background = '#F0AD4E'
			} else {
				this.radioinput[i].parentElement.style.background = 'none'
			}
		}
	}
	//点击时修改背景色的方法
kitchenCheck.prototype.setTapRadioParentBK = function() {
	var self = this
	for (i = 0; i < self.radioinput.length; i++) {
		self.radioinput[i].addEventListener('change', function() {
			var _name = this.getAttribute('name')
			var _name_input = document.querySelectorAll('input[name="' + _name + '"]');
			seBK(_name_input)
		}, false)
	}

	function seBK(nameinput) {
		for (i = 0; i < nameinput.length; i++) {
			if (nameinput[i].checked == true) {
				nameinput[i].parentElement.style.background = '#F0AD4E'
			} else {
				nameinput[i].parentElement.style.background = 'none'
			}
		}
	}
}
kitchenCheck.prototype.ajaxGetTeacherList = function() {
	var self = this
	mui.ajax(this.teachersurl + 'KgId=' + this.kgid + '', {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			if (data.Success == 10000) {
				self.addTeacherList(self.teacherlist, data.RerurnValue, 80)
			}
		},
		error: function() {}
	})
}
kitchenCheck.prototype.addTeacherList = function(teacherlist, data, selectedvalue) {
	var _length = data.length
	var _html
	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].UserId + '" >' + data[i].Name + '</option>'
		} else {
			if (data[i].UserId == selectedvalue) {
				_html += '<option value="' + data[i].UserId + '" selected>' + data[i].Name + '</option>'
			} else {
				_html += '<option value="' + data[i].UserId + '" >' + data[i].Name + '</option>'
			}
		}
	}
	teacherlist.innerHTML += _html
}


//添加检测项的方法
kitchenCheck.prototype.ajaxGetChecklist = function() {
		var self = this
		mui.ajax(this.checklisturl + 'KgId=' + this.kgid + '&KitchenCheckType=KitchenCheckType', {
			dataType: 'json',
			type: 'get',
			timeout: 5000,
			success: function(data) {
				if (data.Success == 10000) {
					self.addCheckList(data.RerurnValue)
						//添加背景色的事件
					self.initRadioParentBk()
						//添加背景色的点击处理事件
					self.setTapRadioParentBK()

				}
			},
			error: function() {

			}
		})
	}
	//添加检查项进入dome
kitchenCheck.prototype.addCheckList = function(data) {
		var _length = data.length;
		var _html = "";
		for (i = 0; i < _length; i++) {
			_html += '<tr><td width="25%">' + data[i].DataDictionaryName + '</td><td width="20%">'
			_html += '<label><span class="radio_span"><input type="radio" hidden="hidden" checked="checked" name="CheckResult' + i + '" value="1" />合格</span></label>'
			_html += '</td><td width="20%"><label><span class="radio_span"><input type="radio" hidden="hidden" name="CheckResult' + i + '" value="0" />不合格</span></label>'
			_html += '</td><td width="35%"><input type="text" name="description' + i + '" value=""  class="bz_text"/><input  hidden="hidden"  name="DataDictionaryId"  value="' + data[i].DataDictionaryId + '" /></td></tr>'
		}
		this.checktable.innerHTML += _html
	}
	//获取检查项的数据值
kitchenCheck.prototype.geSendArrValue = function() {
		var self = this
		var sendjsonstr = ''
		var kMKitchenCheckDetailList = [];
		var _tr = this.checktable.querySelectorAll('tr')
		var _length = _tr.length
		for (i = 0; i < _length; i++) {
			var _id = parseInt(_tr[i].querySelector('input[name="DataDictionaryId"]').value)
			var _result =parseInt( _tr[i].querySelector('input[type="radio"]:checked').value)
			var _description = _tr[i].querySelector('input[name="description' + i + '"]').value
			var _value = {
				"KitchenCheckDetailId": _id,
				"KitchenCheckId": self.kitchencheckid,
				"KMItemId": _id,
				"CheckResult": _result,
				"Description": _description
			}
			kMKitchenCheckDetailList.push(_value)
		}
		kMKitchenCheckDetailList = JSON.stringify(kMKitchenCheckDetailList)
		var examinatorId = self.teacherlist.value,
			examinatorName = self.teacherlist.options[self.teacherlist.selectedIndex].text;
		var _time = new Date()
		var nowtime = _time.Format("yyyy-MM-ddThh:mm:ss")
		sendjsonstr = '{"kMKitchenCheckDetailList":' + kMKitchenCheckDetailList + ',"KitchenCheckId":' + self.kitchencheckid + ',"OrganizationId":' + self.kgid + ',';
		var creatMES = '"Creator":' + self.userName + ',"CreatorId":' + self.userId + ',"CreateDate":"' + nowtime + '",';
		var examinatorMes = '"ExaminatorName":' + self.userName + ',"ExaminatorId":' + self.userId + ',"CheckDate":"' + nowtime + '",';
		var modifyMes = '"ExaminatorName":"","ExaminatorId":,"ModifyDate":""}';
		sendjsonstr = sendjsonstr + creatMES + examinatorMes + modifyMes
	    return sendjsonstr
	}
	//检查提交事件
kitchenCheck.prototype.sendBtnTap = function() {
	var self = this
	self.senbtn.addEventListener('tap', function() {
		self.ajaxSendCheckMES()
	}, false)

	kitchenCheck.prototype.ajaxSendCheckMES = function() {
		var self = this
		var examinatorId = self.teacherlist.value
		if (examinatorId == '') {
			mui.alert("请选择检查人", "提示", function() {
				return
			})
		}
		mui.ajax(self.sendurl , {
			type: 'post',
			dataType:'json',
			data: self.geSendArrValue() ,
			timeout: 5000,
			success: function(data) {
				if (data.Success == 10000) {
					mui.alert('提交成功！', '提示', function() {
						mui.back()
					})
				}
			},
			error: function() {
//			mui.alert('提交失败！', '提示')
			}
		})



	}





}