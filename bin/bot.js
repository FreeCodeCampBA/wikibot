#!/usr/bin/env node

'use strict'

/**
 * WikiBot launcher script.
 *
 * @author Nicolas Quiroz <nh.quiroz@gmail.com>
 */

var WikiBot = require('../lib/wikibot')

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY: the authentication token to allow the bot to connect to your slack organization.
 *  BOT_NAME: the username you want to give to the bot within your organization.
 */
var token = process.env.BOT_API_KEY || require('../token')
var name = process.env.BOT_NAME

var wikibot = new WikiBot({
  token: token,
  name: name
})

wikibot.run()
