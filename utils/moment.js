const moment = require("moment");

const SLASH_DMYHMS = "DD/MM/YYYY HH:mm:ss";


module.exports.dateThai = () => {
        return moment().format(SLASH_DMYHMS);
}



