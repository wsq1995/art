<template>
    <div class="md-example-child md-example-child-cell-item md-example-child-cell-item-0" style="background: #fff;">
        <div class="prompt">
            <p>注：</p>
            <p>请先点击编号,选择考勤号前缀,然后输入号码点击验证。如果考勤编号正确，则会显示出对应的人员信息,</p>
            <p> 在确认人员信息之后请输入手机号码，确认无误之后点击保存</p>

        </div>
        <md-field style="text-align: left;">
            <md-input-item
                    ref="name"
                    preview-type="text"
                    v-model="formData.attendance"
                    title="考勤号"
                    placeholder="考勤号数字部分"
                    is-title-latent
            >
                <div slot="left" @click="showSelectNumber" style="font-size: 17px;">
                    {{selectText === "请选择" || !selectText ? "编号": selectText }}
                    <md-icon style="font-size: 17px;" name="arrow-down" size="lg"></md-icon>
                    —
                </div>

                <div slot="right" @click="getAttendance">
                    <md-button size="small" inline>验证</md-button>
                </div>
            </md-input-item>

            <md-input-item
                    ref="id"
                    type="phone"
                    title="电话"
                    preview-type="text"
                    v-model="formData.phone"
                    placeholder="电话"
                    is-title-latent
                    is-virtual-keyboard
            ></md-input-item>

            <md-input-item
                    title="姓名"
                    v-model="formData.name"
                    readonly
            ></md-input-item>

            <md-input-item
                    title="性别"
                    v-model="formData.favorites"
                    readonly
            ></md-input-item>

        </md-field>

        <div class="prompt md-example-child-popup-0">
            <p>注：</p>
            <p>请仔细和对上面的信息,如果有误请点击下方帮</p>
            <p>助按钮,如提示当前考勤编号已被使用，请点击</p>
            下方帮助按钮
            <div style="text-align: right;padding-right: 30px;">
                <md-button type="primary " size="small" inline @click="showPopUp">帮助</md-button>
                <md-popup
                        v-model="isPopupRight"
                        position="right"
                >
                    <div class="md-example-popup md-example-popup-right" >

                        <md-input-item
                                ref="name"
                                preview-type="text"
                                v-model="formDataNew.name"
                                title="姓名"
                                placeholder="请输入姓名"
                                is-title-latent
                        ></md-input-item>

                        <md-input-item
                                ref="name"
                                preview-type="text"
                                v-model="formDataNew.department"
                                title="部门"
                                placeholder="请输入部门"
                                is-title-latent
                        ></md-input-item>

                        <md-input-item
                                ref="id"
                                type="phone"
                                title="电话"
                                preview-type="text"
                                v-model="formDataNew.phone"
                                placeholder="电话"
                                is-title-latent
                                is-virtual-keyboard
                        ></md-input-item>

                        <md-field-item style="color: #2c3e50;" title="性别" solid>
                            <md-radio name="男" v-model="formDataNew.favorites" label="男" inline />
                            <md-radio name="女" v-model="formDataNew.favorites" label="女" inline />
                        </md-field-item>

                        <div class="div-res">
                            <md-button type="primary" round @click="saveDataState">提交</md-button>
                        </div>

                    </div>
                </md-popup>
            </div>
        </div>
        <div style="padding: 30px;" >
            <md-button type="primary"  round @click="saveData">提交</md-button>
        </div>

        <md-picker
                v-model="pickerIsFlag"
                ref="picker"
                :data="pickerDataNew"
                @initialed="onPickerInitialed"
                @change="onPickerConfirm"
        ></md-picker>
    </div>
</template>

<script>
    import {
        InputItem,
        Field,
        Radio,
        FieldItem,
        RadioList,
        RadioGroup,
        Button,
        Picker,
        DropMenu,
        CellItem,
        Toast,
        Icon,
        Popup,
        PopupTitleBar
    } from "mand-mobile";
   // -----
    import { treeDataTranslate } from '@/util'
    import { isMobile } from '@/util/validate'

    export default {
        name: "HelloWorld",
        components: {
            [InputItem.name]: InputItem,
            [Field.name]: Field,
            [Radio.name]: Radio,
            [FieldItem.name]: FieldItem,
            [RadioList.name]: RadioList,
            [RadioGroup.name]: RadioGroup,
            [Button.name]: Button,
            [Picker.name]: Picker,
            [DropMenu.name]: DropMenu,
            [CellItem.name]: CellItem,
            [Toast.name]: Toast,
            [Icon.name]: Icon,
            [Popup.name]: Popup,
            [PopupTitleBar.name]: PopupTitleBar
        },
        data() {
            return {
                formData: {
                    name: '',
                    phone: '',
                    attendance: '',
                    favorites: "",
                    department: ""
                },
                selectText: "编号",
                pickerDataNew: [[
                    {text: '请选择', value: "编号"},
                    {text: 'k1', value: "k1"},
                    {text: 'k2', value: "k2"},
                    {text: 'k3', value: "k3"},
                    {text: 'k4', value: "k4"},
                ]],
                formDataNew: {
                    name: '',
                    phone: '',
                    attendance: '',
                    favorites: "",
                    department: ""
                },
                show: false,
                pickerIsFlag: false,
                isPopupRight: false,
                orgList: []
            }
        },
        methods: {
            showSelectNumber() {
                window.console.log("123")
                this.pickerIsFlag = true
            },
            onPickerInitialed() {
                const value = this.$refs.picker.getColumnValues()
                window.console.log(`[Mand Mobile] Picker Initialed: ${JSON.stringify(value)}`)

            },
            onPickerConfirm(columnIndex, itemIndex, value) {
                if (value) {
                    this.selectText = value.text
                }
            },
            // 获取用户数据
            getAttendance() {
                this.getData()
                var attendance = this.getFormData()
                this.$http({
                    url: this.$http.adornUrl('/app/sys/sysuserdata/userData'),
                    method: 'get',
                    params: this.$http.adornParams({
                        attendance: attendance
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.formData.name = data.data.name
                        this.formData.favorites = data.data.sex
                        this.formData.phone = data.data.phone ? data.data.phone : ''
                        this.formData.id = data.data.id
                    } else {
                        this.formData.name =''
                        this.formData.favorites = ''
                        this.formData.phone = ''
                        this.formData.id =''
                        Toast.failed(data.msg)
                    }
                })
            },
            // 数据验证
            getData() {
                if (!this.selectText) {
                    Toast.failed('请选择编号')
                    return
                }
                if (!this.formData.attendance) {
                    Toast.failed('请输入考勤号')
                    return
                }
                var attendance = parseInt(this.formData.attendance)
                if (this.formData.attendance && isNaN(attendance)) {
                    Toast.failed('请输入正确的考勤编号')
                    return
                }
            },
            // 数据转换
            getFormData() {
                var attendance = parseInt(this.formData.attendance)
                if (attendance < 10) {
                    attendance = "00" + attendance
                } else if (attendance < 100 && attendance > 10) {
                    attendance = "0" + attendance
                }
                return this.selectText + "-" + attendance
            },
            // 保存用户数据
            saveData() {
                if (!this.formData.name) {
                    Toast.failed('请先验证考勤号')
                    return
                }

                if(!isMobile(this.formData.phone)){
                    Toast.failed('请输入正确的电话')
                    return
                }
                // return
                this.$http({
                    url: this.$http.adornUrl('/app/sys/sysuserdata/update'),
                    method: 'get',
                    params: this.$http.adornParams({
                        phone: this.formData.phone,
                        id: this.formData.id
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        Toast.succeed('操作成功')
                        this.chearData()
                    }
                })
            },
            saveDataState(){
                this.savevalidate()
                // return
                this.$http({
                    url: this.$http.adornUrl('/app/sys/sysuserdata/save'),
                    method: 'get',
                    params:  this.$http.adornParams({
                        phone: this.formDataNew.phone,
                        name: this.formDataNew.name,
                        sex: this.formDataNew.favorites,
                        department: this.formDataNew.department,
                        state: 1
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        Toast.succeed('提交完成，我们会尽快处理')
                        this.chearData()
                        this.chearDataNew()
                    }
                })
            },
            // 新增校验
            savevalidate(){
                if(!this.formDataNew.name){
                    Toast.failed('请输入姓名')
                    return
                }
                if(!this.formDataNew.favorites){
                    Toast.failed('请选择性别')
                    return
                }
                if(!this.formDataNew.department){
                    Toast.failed('请输入部门')
                    return
                }
                if(!this.formDataNew.phone){
                    Toast.failed('请输入电话号码')
                    return
                }
                if(!isMobile(this.formDataNew.phone)){
                    Toast.failed('请输入正确的电话')
                    return
                }
            },
            chearDataNew(){
                this.formDataNew.name = ''
                this.formDataNew.favorites = ''
                this.formDataNew.phone = ''
                this.formDataNew.id = ''
                this.formDataNew.department= ''
            },
            chearData() {
                // this.$refs.picker.startColumnIndex()
                // this.selectText = ''
                this.formData.name = ''
                this.formData.favorites = ''
                this.formData.phone = ''
                this.formData.id = ''
                this.formData.attendance = ''
                this.formData.department= ''
            },
            showPopUp(){
                this.isPopupRight = true
            },
            // 获取全部的部门
            getDept(){
                this.$http({
                    url: this.$http.adornUrl('/app/bm/organization/typeList'),
                    method: 'get'
                }).then(({data}) => {
                    if (data && data.code === 0) {

                        data.list.forEach(i=>{
                            i['label'] = i.name
                            i['value'] = i.id
                        })
                       this.orgList = [treeDataTranslate(data.list)]
                    }
                })
            },

        }
    };
</script>

<style scoped>
    .bottom {
        border: solid black;
        border-width: 0 1px 1px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
    }
    .prompt{
        background: #fff;
        font-size: 0.35rem;
        color: red;
        text-align: left;
        padding: 0 20px;
    }
    .div-res{
        position: absolute;
        bottom: 4%;
        left: 10%;
        right: 10%;
    }

</style>

<style lang="stylus">
    .md-example-child-popup-0
        float left
        width 100%
        .md-button
            margin-bottom 20px
        .md-example-popup
            position relative
            font-size 28px
            font-family DINPro
            font-weight 500
            box-sizing border-box
            text-align center
            background-color #FFF
        .md-example-popup-center
            padding 50px
            border-radius radius-normal
        .md-example-popup-top
            width 100%
            height 75px
            line-height 75px
            background #4a4c5b
            color #fff
            .md-icon
                position absolute
                right 20px
                top 50%
                transform translateY(-50%)
        .md-example-popup-bottom
            width 100%
            padding 100px 0
            p
                line-height 50px
        .md-example-popup-left, .md-example-popup-right
            height 100%
            padding 0 100px
            padding-top 10%
</style>
