const { B13, B14, B15, B16, B17, B18, B19, OUTS } = process.env
exports.token = process.env.SECRET
exports.slack = process.env.SLACK_TOKEN
exports.webhookURL = process.env.INVITE_CHANNEL_WEBHOOK
exports.glitch = process.env.GLITCH_SECRET

const dict = {}
dict['2013'] = B13
dict['2014'] = B14
dict['2015'] = B15
dict['2016'] = B16
dict['2017'] = B17
dict['2018'] = B18
dict['2019'] = B19
dict['outsider'] = OUTS

exports.dict = dict
