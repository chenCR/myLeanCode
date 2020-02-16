// 映射表
const MapTable = (target) => {
    let resultArr = [];
    const mapArr = {
        0: '',
        1: '',
        2: 'ABC',
        3: 'DEF',
        4: 'GHI',
        5: 'JKL',
        6: 'MNO',
        7: 'PQRS',
        8: 'TUV',
        9: 'WXYZ',
    };
    target = target.replace(/[0-1]/, '');
    if (target.length === 1) {
        return [...mapArr[target]]
    }
    const getResult = (beforeLen = 0, str = '') => {
        // 递归终止条件: 最后一轮的循环的字符长度 === 前一轮的长度，返回最后的数组
        if (beforeLen === target.length) {
            resultArr.push(str);
            return;
        }
        let tempArr = mapArr[target[beforeLen]].split('');
        tempArr.map(item => {
            getResult(beforeLen + 1, `${str}${item}`)
        })
        // for (let i = 0; i <= tempArr.length; i++) {
        //     getResult(beforeLen + 1, `${str}${tempArr[i]}`)
        // }
    }
    getResult();
    return resultArr;
}
console.log(MapTable('01'));
console.log(MapTable('12'));
console.log(MapTable('22'));
console.log(MapTable('23'));
console.log(MapTable('234'));