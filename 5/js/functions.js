const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayElement = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];

export { getRandomInteger, getRandomArrayElement };

function getTimeInMinutes(time) {
  const workStart = time.split(":");
  const hours = Number(workStart[0]);
  const minutes = Number(workStart[1]);
  const workStartInMinutes = hours * 60 + minutes;
  return workStartInMinutes;
}

function isMeetingInWorkTime(workStart, workEnd, meetingStart, duration) {
  const workStartMinutes = getTimeInMinutes(workStart);
  const workEndMinutes = getTimeInMinutes(workEnd);
  const meetingStartMinutes = getTimeInMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + duration;

  return (
    meetingStartMinutes >= workStartMinutes &&
    meetingEndMinutes <= workEndMinutes
  );
}
