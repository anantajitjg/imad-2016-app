/* 
 Created on : Dec 03, 2016
 Author     : Anantajit
 */
//creating emoji
var emojiMap = {":angry:": "angry", ":astonished:": "astonished", ":confused:": "confused", ":disappointed:": "disappointed", ":grin:": "grin", ":grinning:": "grinning", ":joy:": "joy", ":laughing:": "laughing", ":nerd:": "nerd", ":neutral_face:": "neutral_face", ":open_mouth:": "open_mouth", ":relieved:": "relieved", ":slight_smile:": "slight_smile", ":smile:": "smile", ":smiley:": "smiley", ":sunglasses:": "sunglasses", ":thinking:": "thinking", ":thumbsdown:": "thumbsdown", ":thumbsup:": "thumbsup", ":unamused:": "unamused", ":wink:": "wink", ":-))": "laughing", ":)": "slight_smile", ":-)": "smiley", ":->": "grin", "=D": "grinning", ">:(": "angry", "B-)": "sunglasses", ",-)": "wink"};
var emoji = new Array();
var metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;
$.each(emojiMap, function (i) {
    if (emojiMap.hasOwnProperty(i)) {
        emoji.push('(' + i.replace(metachars, "\\$&") + ')');
    }
});
function createEmoji(string) {
    var regEx = new RegExp(emoji.join("|"), "g");
    return String(string).replace(regEx, function (s) {
        return "<img src='/img/emoji/" + emojiMap[s] + ".png' alt='" + s + "' class='emoji' title=':" + emojiMap[s] + ":' />";
    });
}

