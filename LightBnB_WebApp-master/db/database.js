const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "chrisdea",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

// --- USERS ---

/**
 * GET a single USER FROM the database given their EMAIL.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  /* let resolvedUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      resolvedUser = user;
    }
  }
  return Promise.resolve(resolvedUser); */

  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      //if query comes back as zero resolve null
      if (result.rows.length === 0) {
        return null;
      }
      console.log("Logging in as: ", result.rows[0]);
      return result.rows[0];
    }
    )
    .catch((err) => {
      console.log('Error getting user with email', err.message);
      throw err;
    });
};

/**
 * ------ GET A SINGLE USER FROM THE DATABASE given their ID. ---
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
/*  return Promise.resolve(users[id]); */
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      console.log("Logged in as: ", result.rows[0]);
      return result.rows[0];
    }
    )
    .catch((err) => {
      console.log('Error getting user with ID', err.message);
      throw err;
    });
};

/**
 * -----  ADD A NEW USER to the database. -----
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  /* const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user); */

  return pool
    .query(`INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      console.log("User added:", result.rows[0]);
      return result.rows[0];
    }
    )
    .catch((err) => {
      console.log('Error adding the user', err.message);
      throw err;
    });
};

// RESERVATIONS

/**
 * ------ GET ALL RESERVATIONS for a single user. -------
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// PROPERTIES

/**
 * -------- GET ALL PROPERTIES. ---------
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      //console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error getting all properties', err.message);
    });
};


/**
 * ------- ADD A PROPERTY to the database ---------
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
  pool
};
