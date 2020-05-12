const { execSync } = require('child_process');

module.exports = () => {
  try {
    const res = execSync('du -s -B1 /var/log | tr -d -c 0-9');
    return Number(res);
  } catch (error) {
    console.error('Something went wrong while calculating disk space..');
    console.error(error);
  }
};
