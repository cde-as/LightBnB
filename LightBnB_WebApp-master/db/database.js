/* eslint-disable camelcase */
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "chrisdea",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

// ---------------- USERS -----------------------

/**
 * GET a single USER FROM the database given their EMAIL.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      //if query comes back as zero resolve null
      if (result.rows.length === 0) {
        return null;
      }
      console.log("Logging in as: ", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error getting user with email", err.message);
      throw err;
    });
};

/**
 * ------ GET A SINGLE USER FROM THE DATABASE given their ID. ---
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      console.log("Logged in as: ", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error getting user with ID", err.message);
      throw err;
    });
};

/**
 * -----  ADD A NEW USER to the database. -----
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING *`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      console.log("User added:", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error adding the user", err.message);
      throw err;
    });
};

// ---------------- RESERVATIONS ------------------------

/**
 * ------ GET ALL RESERVATIONS for a single user. -------
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// eslint-disable-next-line camelcase
const getAllReservations = function(guest_id, limit = 10) {

  return pool
    .query(
      `SELECT reservations.*, properties.*
            FROM reservations
            JOIN users ON users.id = reservations.guest_id
            JOIN properties ON properties.id = reservations.property_id
            WHERE guest_id = $1
            LIMIT $2
            `,
      [guest_id, limit]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        console.log("No reservations found");
        return null;
      }
      //console.log("Reservations:", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log("Error adding the user", err.message);
      throw err;
    });
};

///------------------ PROPERTIES ------------------------

/**
 * -------------- GET ALL PROPERTIES. -------------------
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryString.length === 1) {
      queryString += `WHERE owner_id LIKE $${queryParams.length}`;
    } else {
      queryString += `AND owner_id LIKE $${queryParams.length}`;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Cents to Dollars
    if (queryString.length === 1) {
      queryString += `WHERE cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Cents to Dollars
    if (queryString.length === 1) {
      queryString += `WHERE cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `AND cost_per_night <= $${queryParams.length}`;
    }
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    if (queryString.length === 1) {
      queryString += `WHERE property_reviews.rating >= $${queryParams.length}`;
    } else {
      queryString += `AND property_reviews.rating >= $${queryParams.length}`;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log("Error getting all properties", err.message);
    });
};

/**
 * ------- ADD A PROPERTY to the database ---------
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // 1
  return new Promise((resolve, reject) => {
    const queryParams = [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
    ];

    // 2
    let queryString = ` INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;

    return pool
      .query(queryString, queryParams)
      .then((res) => res.rows[0])
      .catch((err) => {
        console.log("Error getting my listings", err.message);
      });
  });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
  pool,
};
