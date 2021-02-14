export const processPlayer = (battleLog) => {
  return winLossRatio(battleLog);
};

export const winLossRatio = (battleLog) => {
  let victories = 0;
  let loses = 0;
  let vlratio = 0;
  console.log(battleLog);
  battleLog.map((x) => {
    console.log(x.battle.result);
    if (x.battle.result == "victory") {
      victories++;
    } else loses++;
  });

};
