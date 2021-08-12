import { netBaseUrl } from '../boot';
import { GTip, GDanger, formatDate } from '../util';

var axios = require('axios').default;
/**
 * Record:{
 *      role:{sstring}, 角色的基本信息，一个json而不是字符串
 *      opened:[number], 开启的关卡代号
 *      updateTime:string
 * }
 */
export class RecordController {

    static id
    static uuid
    static records = []

    static getRecords() {
        return this.records;
    }

    static login(uname, upass) {
        return axios.post(netBaseUrl + 'login', {
            uname,
            upass
        }).then(res => {
            let { uuid, id, records } = res.data;
            RecordController.uuid = String(uuid);
            RecordController.id = id;
            RecordController.records = records.map(r => JSON.parse(r));
        });
    }
    static getRecord(index) {
        return this.records[index];
    }
    static newRecord(role) {
        // 初始化一个存档
        return {
            net: false,
            roles: role,
            opened: [0]
        }
    }
    static newNetRecord(role, rrid, isHomer) {
        return {
            net: true,
            roles: role,
            opened: [0],
            rrid,
            isHomer
        };
    }
    static logout() {
        this.id = undefined;
        this.uuid = undefined;
        this.records = [];
    }
    static saveRecord(index, record) {
        record.updateTime = formatDate(new Date(), 'yy-MM-dd hh:mm:ss');
        record.index = index;
        this.records[index] = record;
        axios.post(netBaseUrl + 'save', {
            id: this.id,
            uuid: this.uuid,
            record: record,
            recordId: index
        }).then(res => {
            new GTip('保存成功');
        }).catch(err => {
            new GDanger('保存失败');
        })
    }
}