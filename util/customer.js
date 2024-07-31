const newCustomer = (username, id, users) => {
  const user = {
    username,
    id,
  };
  users.push(user);
  return user;
};

module.exports = { newCustomer };
