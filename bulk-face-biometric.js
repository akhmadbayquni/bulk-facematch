const fs = require('fs');
const fetch = require('node-fetch');

let data = fs.readFileSync('./temp/tes.csv')
.toString()
.split('\n')
.map(e => e.trim())
.map(e => e.split(',').map(e => e.trim()))

const writeStream = fs.createWriteStream('./temp/data.csv');

for(let i = 0; i < data.length; i++){
    if(i == 0){
        writeStream.write(`${data[i]} \n`)
        //test

    }else{
        
        let nik = data[i][0]
        let namaFile = './foto/'+ nik + '.png'
        let encodeBase64 = fs.readFileSync(namaFile, 'base64');
        let body = {
            trx_id: `${i}`,
            nik: data[i][0],
            selfie_photo: encodeBase64
        }
        let ktp = 'KTP-' + data[i][0]
        // console.log(body)
            fetch('https://api.digidata.ai/internal_ddtt/verify_face_biometric', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                'token': 'MGE0NGI5MTAtMWJjNC00MDk0LThlMjMtMDc3ZGJlY2VjNjMw'
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            data[i][0] = json.trx_id
            data[i][1] = ktp
            data[i][2] = json.data.selfie_photo
            data[i][3] = json.message
            data[i][4] = json.status
            data[i][5] = json.timestamp
            data[i][6] = json.ref_id
            writeStream.write(`${data[i]} \n`)
            
        })
        setTimeout(() => 3000);
        
        
    }
}