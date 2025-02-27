const bcrypt = require('bcryptjs');

const comparePassword = async (inputPassword, storedHashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

module.exports = comparePassword;
