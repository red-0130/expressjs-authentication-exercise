const users: Express.User[] = [];

const db = {
  async findUserByUsername(username: string): Promise<Express.User | null> {
    return users.find((u) => u.username === username) || null;
  },

  async findUserById(id: string): Promise<Express.User | null> {
    return users.find((u) => u.id === id) || null;
  },

  async createUser(username: string, hashedPassword: string): Promise<Express.User> {
    const newUser: Express.User = { id: crypto.randomUUID(), username, password: hashedPassword };
    users.push(newUser);
    return newUser;
  },

  // Helper to reset the DB between tests
  _reset(): void {
    users.length = 0;
  },
};

export default db;
