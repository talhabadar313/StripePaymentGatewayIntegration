import axios from "axios";

const confirmpaymentintent=(data)=>{
    return new Promise((resolve, reject) => {
        axios.post('http://192.168.0.104:4000/payment-sheet', data)
            .then(function (res) {
                resolve(res.data); // Resolve with the data property of the response
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

export default confirmpaymentintent