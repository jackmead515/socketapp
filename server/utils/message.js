var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: getDate()
  };
};

var generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: getDate()
  };
};

function getDate() {
  var today = new Date();
  return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
};

module.exports = {
  generateMessage,
  generateLocationMessage,
  getDate
};
