export interface SeatInfo {
  center: string;
  building: string;
  floor: string;
  room: string;
  isMainCenter: boolean;
}

export interface RoomMapping {
  id: string;
  room: string;
  label: string;
  center: string;
  group: string;
  rollRange: string;
}

export const ROOM_MAPPINGS: RoomMapping[] = [
  { id: '301-main', room: '301', label: '301', center: "Govt. Pioneer Women's College", group: 'Science', rollRange: '511454 - 511527' },
  { id: '302-main', room: '302', label: '302', center: "Govt. Pioneer Women's College", group: 'Science', rollRange: '511528 - 511601' },
  { id: '304-main', room: '304', label: '304', center: "Govt. Pioneer Women's College", group: 'Science', rollRange: '511602-659, 511796-850' },
  { id: '201-main', room: '201', label: '201', center: "Govt. Pioneer Women's College", group: 'Science', rollRange: '511660 - 511725' },
  { id: '202-main', room: '202', label: '202', center: "Govt. Pioneer Women's College", group: 'Science', rollRange: '511726 - 511795' },
  { id: 'Biology-main', room: 'Biology', label: 'Biology', center: "Govt. Pioneer Women's College", group: 'Humanities', rollRange: '641703 - 641730' },
  { id: '108-main', room: '108', label: '108', center: "Govt. Pioneer Women's College", group: 'Hum & Bus', rollRange: '641690-702, 806965-995' },
  { id: '106-main', room: '106', label: '106', center: "Govt. Pioneer Women's College", group: 'Humanities', rollRange: '641574 - 641631' },
  { id: '107-main', room: '107', label: '107', center: "Govt. Pioneer Women's College", group: 'Humanities', rollRange: '641632 - 641689' },
  { id: '306-main', room: '306', label: '306', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806634 - 806691' },
  { id: '307-main', room: '307', label: '307', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806692 - 806751' },
  { id: '308-main', room: '308', label: '308', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806752 - 806797' },
  { id: '206-main', room: '206', label: '206', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806798 - 806858' },
  { id: '207-main', room: '207', label: '207', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806859 - 806918' },
  { id: '208-main', room: '208', label: '208', center: "Govt. Pioneer Women's College", group: 'Business', rollRange: '806919 - 806964' },
  { id: '201-sub', room: '201', label: '201 (AK)', center: "Azam Khan Commerce College", group: 'Humanities (Male)', rollRange: '641731 - 641800' },
  { id: '203-sub', room: '203', label: '203 (AK)', center: "Azam Khan Commerce College", group: 'Humanities (Male)', rollRange: '641801 - 641873' },
];

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
