var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	// logging: false
});

let pageSchema = {
	title: { 
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: { 
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed'),
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
}

var pageConfig = {
	hooks: {
		beforeValidate: function(page) {
		  if (page.title) {
		    // Removes all non-alphanumeric characters from title
		    // And make whitespace underscore
		    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
		  } else {
		    // Generates random 5 letter string
		    page.urlTitle = Math.random().toString(36).substring(2, 7);
		  }
		}
	},
	getterMethods: {
    route: function() { return '/wiki/' + this.urlTitle }
  }
}

var Page = db.define('page', pageSchema, pageConfig)


let userSchema = {
	name: { 
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	}
}

var userConfig = {}
var User = db.define('user', userSchema, userConfig)

// Page.belongsToMany(User, { through: 'postTag' })
// User.belongsToMany(Page, { through: 'postTag' })

User.hasMany(Page, { as: 'author' });
Page.belongsTo(User, { as: 'author' })


module.exports = {
	Page: Page,
	User: User,
	db: db
}