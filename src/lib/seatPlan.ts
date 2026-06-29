export interface SeatInfo {
  center: string;
  building: string;
  floor: string;
  room: string;
  isMainCenter: boolean;
}

export function getSeatInfo(boardRollStr: string | null | undefined): SeatInfo | null {
  if (!boardRollStr) return null;
  const roll = parseInt(boardRollStr, 10);
  if (isNaN(roll)) return null;

  const mainCenter = "Govt. Pioneer Women's College";
  const subCenter = "Azam Khan Govt. Commerce College";

  // Science
  if (roll >= 511454 && roll <= 511527) return { center: mainCenter, building: "Building 1", floor: "3rd", room: "301", isMainCenter: true };
  if (roll >= 511528 && roll <= 511601) return { center: mainCenter, building: "Building 1", floor: "3rd", room: "302", isMainCenter: true };
  if ((roll >= 511602 && roll <= 511659) || (roll >= 511796 && roll <= 511850)) return { center: mainCenter, building: "Building 1", floor: "3rd", room: "304", isMainCenter: true };
  if (roll >= 511660 && roll <= 511725) return { center: mainCenter, building: "Building 1", floor: "2nd", room: "201", isMainCenter: true };
  if (roll >= 511726 && roll <= 511795) return { center: mainCenter, building: "Building 1", floor: "2nd", room: "202", isMainCenter: true };

  // Humanities
  if (roll >= 641703 && roll <= 641730) return { center: mainCenter, building: "Building 1", floor: "2nd", room: "Biology", isMainCenter: true };
  if (roll >= 641690 && roll <= 641702) return { center: mainCenter, building: "Honours Building", floor: "Ground", room: "108", isMainCenter: true };
  if (roll >= 641574 && roll <= 641631) return { center: mainCenter, building: "Honours Building", floor: "Ground", room: "106", isMainCenter: true };
  if (roll >= 641632 && roll <= 641689) return { center: mainCenter, building: "Honours Building", floor: "Ground", room: "107", isMainCenter: true };
  if (roll >= 641731 && roll <= 641800) return { center: subCenter, building: "Building 1", floor: "2nd", room: "201", isMainCenter: false };
  if (roll >= 641801 && roll <= 641873) return { center: subCenter, building: "Building 1", floor: "2nd", room: "203", isMainCenter: false };

  // Business Studies
  if (roll >= 806634 && roll <= 806691) return { center: mainCenter, building: "Honours Building", floor: "3rd", room: "306", isMainCenter: true };
  if (roll >= 806692 && roll <= 806751) return { center: mainCenter, building: "Honours Building", floor: "3rd", room: "307", isMainCenter: true };
  if (roll >= 806752 && roll <= 806797) return { center: mainCenter, building: "Honours Building", floor: "3rd", room: "308", isMainCenter: true };
  if (roll >= 806798 && roll <= 806858) return { center: mainCenter, building: "Honours Building", floor: "2nd", room: "206", isMainCenter: true }; // Merged 806798-806809 and 806810-806858
  if (roll >= 806859 && roll <= 806918) return { center: mainCenter, building: "Honours Building", floor: "2nd", room: "207", isMainCenter: true };
  if (roll >= 806919 && roll <= 806964) return { center: mainCenter, building: "Honours Building", floor: "2nd", room: "208", isMainCenter: true };
  if (roll >= 806965 && roll <= 806995) return { center: mainCenter, building: "Honours Building", floor: "Ground", room: "108", isMainCenter: true };

  return null;
}
