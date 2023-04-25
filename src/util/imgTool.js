function getImgURL(imgUrl){
    var url = [];
    url = "http://localhost:9000/image/" + imgUrl
    return url;
}
export default {
    getImgURL
}