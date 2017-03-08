module.exports = function (sequelize, DataType) {
	return sequelize.define('user', {
		email: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			Validate: {
				isEmail: true
			}
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			Validate: {
				len: [7, 100]
			}
		}
	}, {
		hook: {
			beforeValidate: function (user, options) {

				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
};