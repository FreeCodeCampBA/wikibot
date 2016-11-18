'use strict';

var util = require('util');
var Bot = require('slackbots');

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token: the API token of the bot (mandatory)
 *      name: the name of the bot (will default to "wikibot")
 *
 * @param {object} settings
 * @constructor
 *
 * @author Nicolas Quiroz <nh.quiroz@gmail.com>
 */
var WikiBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'wikibot';

    this.user = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(WikiBot, Bot);

/**
 * Run the bot
 * @public
 */
WikiBot.prototype.run = function() {
    WikiBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('open', this._onOpen);
    this.on('message', this._onMessage);
};

WikiBot.prototype._onOpen = function() {
    console.log('Wiki Bot connected to Slack...');
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
WikiBot.prototype._onStart = function() {
    this._loadbotUser();
};

/**
 * On message callback, called when a message (of any type) is detected with the Real Time Messaging API
 * @param {object} message
 * @private
 */
WikiBot.prototype._onMessage = function(message) {
    if (this._isChatMessage(message) &&
        //this._isChannelConversation(message) &&
        !this._isFromWikiBot(message) &&
        this._isMentioningLearningResources(message)
    ) {
        this._replyWithWikiURL(message);
    }
};

/**
 * Replyes to a message with the Wiki URL
 * @param {object} originalMessage
 * @private
 */
WikiBot.prototype._replyWithWikiURL = function(originalMessage) {
    var self = this;
    var botResponses = ["Chequeaste nuestra Wiki? Tiene muchísimos recursos gratuitos! https://freecodecampba.org/wiki/",
                 "Psst, tenemos una wiki con muchos recursos gratuitos complementarios (tutoriales, libros, cursos, etc). Pasate! https://freecodecampba.org/wiki/",
                 "Hola! Tenemos una wiki llena de recursos gratuitos. Fijate que seguro encontrás algo que te sirva :) https://freecodecampba.org/wiki/"
    ];
    var response = botResponses[Math.floor(Math.random() * botResponses.length)];
    var channel = self._getChannelById(originalMessage.channel);
    var fromUser = self.users.filter(function(user) {
      return user.id === originalMessage.user;
    })[0]['name'];

    self.postMessageToChannel(channel.name, '@' + fromUser + " " + response, {as_user: true});
};

/**
 * Loads the user object representing the bot
 * @private
 */
WikiBot.prototype._loadbotUser = function() {
    var self = this;
    this.user = this.users.filter(function(user) {
        return user.name === self.name;
    })[0];
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
WikiBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
WikiBot.prototype._isChannelConversation = function(message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

/**
 * Util function to check if a given real time message is mentioning learning resources or the wiki
 * @param {object} message
 * @returns {boolean}
 * @private
 */
WikiBot.prototype._isMentioningLearningResources = function(message) {
    return message.text.toLowerCase().indexOf('libro') > -1 ||
        message.text.toLowerCase().indexOf('libros') > -1 ||
        message.text.toLowerCase().indexOf('curso') > -1 ||
        message.text.toLowerCase().indexOf('cursos') > -1 ||
        message.text.toLowerCase().indexOf('tutorial') > -1 ||
        message.text.toLowerCase().indexOf('tutoriales') > -1 ||
        message.text.toLowerCase().indexOf('guia') > -1 ||
        message.text.toLowerCase().indexOf('guias') > -1 ||
        message.text.toLowerCase().indexOf('recurso') > -1 ||
        message.text.toLowerCase().indexOf('recursos') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

/**
 * Util function to check if a given real time message has ben sent by the wikibot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
WikiBot.prototype._isFromWikiBot = function(message) {
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
WikiBot.prototype._getChannelById = function(channelId) {
    return this.channels.filter(function(item) {
        return item.id === channelId;
    })[0];
};

module.exports = WikiBot;
