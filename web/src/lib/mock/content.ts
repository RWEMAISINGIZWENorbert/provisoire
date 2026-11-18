import type { LocalizedText, Question, Topic } from './types'

/** Helper: English text reused as placeholder for fr/rw until translations land. */
const t = (en: string): LocalizedText => ({ en, fr: en, rw: en })

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'road-signs',
    slug: 'road-signs',
    icon: '🪧',
    order: 1,
    title: t('Road Signs'),
    summary: t('Warning, mandatory, prohibitory and informational signs used on Rwandan roads.'),
    sections: [
      { heading: t('Four sign families'), body: t('Rwandan road signs come in four families: warning signs (triangular, alert you to danger), mandatory signs (blue circles, tell you what you must do), prohibitory signs (red circles, tell you what is forbidden) and informational signs (blue rectangles, give information or directions).') },
      { heading: t('Shape is the clue'), body: t('Learn the shape first: triangles warn, circles command or prohibit, rectangles inform. A red border almost always means "not allowed".') },
    ],
  },
  {
    id: 'speed-limits',
    slug: 'speed-limits',
    icon: '🚗',
    order: 2,
    title: t('Speed Limits'),
    summary: t('Default speed limits in urban areas, outside towns and on highways.'),
    sections: [
      { heading: t('Know the limits'), body: t('In built-up urban areas the default limit is 40 km/h. Outside urban areas limits are higher, and motorways carry their own posted limits. Always respect the lowest posted sign.') },
      { heading: t('Adjust to conditions'), body: t('Speed limits are maximums, not targets. Reduce speed in rain, fog, near schools and at night.') },
    ],
  },
  {
    id: 'right-of-way',
    slug: 'right-of-way',
    icon: '⚖️',
    order: 3,
    title: t('Right of Way & Priority'),
    summary: t('Who goes first at intersections, roundabouts and pedestrian crossings.'),
    sections: [
      { heading: t('The basics'), body: t('At uncontrolled intersections, yield to traffic on your right and to vehicles already in the intersection. Pedestrians on marked crossings always have priority.') },
      { heading: t('Roundabouts and emergencies'), body: t('At roundabouts, yield to traffic already circulating. Always give way to emergency vehicles with flashing lights and sirens.') },
    ],
  },
  {
    id: 'parking',
    slug: 'parking',
    icon: '🅿️',
    order: 4,
    title: t('Parking & Stopping'),
    summary: t('Where you may stop, park and where it is forbidden.'),
    sections: [
      { heading: t('Never park here'), body: t('Never stop or park on a pedestrian crossing, on the sidewalk, in front of a fire hydrant, at a bus stop or anywhere your vehicle blocks traffic flow.') },
      { heading: t('Road markings'), body: t('Yellow lines and specific signs show where stopping is restricted. When in doubt, keep moving — a ticket costs more than a few minutes.') },
    ],
  },
  {
    id: 'traffic-lights',
    slug: 'traffic-lights',
    icon: '🚦',
    order: 5,
    title: t('Traffic Lights & Signals'),
    summary: t('What every light and signal color means for drivers and pedestrians.'),
    sections: [
      { heading: t('Reading the lights'), body: t('Red means stop, green means go when safe, amber means prepare to stop. A flashing amber light means proceed with caution.') },
      { heading: t('Arrows and pedestrians'), body: t('Green arrows give protected turns. A standing red person on the pedestrian signal means do not cross; a walking figure means it is safe.') },
    ],
  },
  {
    id: 'safe-driving',
    slug: 'safe-driving',
    icon: '🛡️',
    order: 6,
    title: t('Safe Driving & Distances'),
    summary: t('Following distances, seatbelts, phones and overtaking rules.'),
    sections: [
      { heading: t('The two-second rule'), body: t('Keep at least a two-second gap between you and the vehicle ahead — more in rain or at speed. This gap is your braking distance buffer.') },
      { heading: t('Distractions kill'), body: t('Wearing a seatbelt is mandatory for all occupants. Using a phone while driving is prohibited — pull over if it cannot wait.') },
    ],
  },
]

const q = (
  id: string,
  topicId: string,
  text: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question => ({ id, topicId, text: t(text), options: options.map(t), correctIndex, explanation: t(explanation) })

export const MOCK_QUESTIONS: Question[] = [
  // ── Road Signs ────────────────────────────────────────────
  q('rs-1', 'road-signs', 'What shape are warning road signs?', ['Circle', 'Triangle', 'Rectangle', 'Diamond'], 1, 'Warning signs are triangular with a red border.'),
  q('rs-2', 'road-signs', 'A red octagonal sign means:', ['Yield', 'Stop', 'No parking', 'School zone'], 1, 'The octagon is reserved for STOP signs.'),
  q('rs-3', 'road-signs', 'Signs with a red circular border are:', ['Mandatory', 'Prohibitory', 'Informational', 'Warning'], 1, 'Red circle = something is not allowed.'),
  q('rs-4', 'road-signs', 'A blue circular sign typically means:', ['Warning', 'Prohibition', 'Mandatory instruction', 'Tourist info'], 2, 'Blue circles tell you what you MUST do (e.g. minimum speed).'),
  q('rs-5', 'road-signs', 'A sign showing children near a school warns of:', ['A playground only', 'Children crossing the road', 'A closed school', 'Sports event'], 1, 'Watch for children — slow down near schools.'),

  // ── Speed Limits ──────────────────────────────────────────
  q('sl-1', 'speed-limits', 'The default speed limit in built-up urban areas is:', ['30 km/h', '40 km/h', '60 km/h', '80 km/h'], 1, 'Urban areas default to 40 km/h unless a sign says otherwise.'),
  q('sl-2', 'speed-limits', 'Speed limits on roads are:', ['Suggestions', 'Maximum allowed speeds', 'Minimum speeds', 'Advisory only'], 1, 'Posted limits are legal maximums.'),
  q('sl-3', 'speed-limits', 'In heavy rain you should:', ['Keep the same speed', 'Reduce your speed', 'Drive faster to finish sooner', 'Use hazard lights on the highway'], 1, 'Reduce speed — braking distances increase on wet roads.'),
  q('sl-4', 'speed-limits', 'The safest following gap is described as:', ['Tailgating', 'A two-second rule', 'Half a car length', 'No gap needed'], 1, 'Two seconds or more between you and the vehicle ahead.'),
  q('sl-5', 'speed-limits', 'A speed camera measures:', ['Engine temperature', 'Your speed', 'Fuel level', 'Tire pressure'], 1, 'Speed cameras (radar) record vehicle speed.'),

  // ── Right of Way ──────────────────────────────────────────
  q('rw-1', 'right-of-way', 'At an uncontrolled intersection, you should yield to:', ['Nobody', 'Traffic on your right', 'Larger vehicles only', 'Buses only'], 1, 'The basic rule: yield to traffic approaching from your right.'),
  q('rw-2', 'right-of-way', 'A pedestrian on a marked crossing always has:', ['No rights', 'Priority over vehicles', 'Priority only at night', 'Priority only if waving'], 1, 'Pedestrians on marked crossings always have priority.'),
  q('rw-3', 'right-of-way', 'When turning left at a junction you must:', ['Speed up', 'Yield to oncoming traffic', 'Ignore oncoming vehicles', 'Sound your horn'], 1, 'Yield to oncoming traffic when turning left.'),
  q('rw-4', 'right-of-way', 'An emergency vehicle with flashing lights approaches. You should:', ['Speed up to clear', 'Pull over and stop', 'Continue normally', 'Flash your headlights'], 1, 'Pull over safely and stop to let it pass.'),
  q('rw-5', 'right-of-way', 'At a roundabout, entering traffic must:', ['Ignore circulating traffic', 'Yield to vehicles already on the roundabout', 'Always go first', 'Stop permanently'], 1, 'Yield to traffic already circulating the roundabout.'),

  // ── Parking ───────────────────────────────────────────────
  q('pk-1', 'parking', 'It is forbidden to park:', ['In a marked bay', 'On a pedestrian crossing', 'Parallel to the curb', 'Near your home'], 1, 'Never park on or near a pedestrian crossing.'),
  q('pk-2', 'parking', 'Parking on the sidewalk is:', ['Allowed for 10 minutes', 'Prohibited', 'Allowed at night', 'Fine if no one complains'], 1, 'Sidewalks are for pedestrians — parking there is prohibited.'),
  q('pk-3', 'parking', 'You should not park within ___ of a fire hydrant:', ['1 meter', '5 meters', 'Any distance is fine', '10 cm'], 1, 'Keep clear of hydrants so firefighters can access them.'),
  q('pk-4', 'parking', 'A solid yellow line along the curb usually means:', ['Free parking', 'No stopping or parking', 'Loading zone', 'Bus lane'], 1, 'Solid yellow lines mark no-stopping/no-parking zones.'),
  q('pk-5', 'parking', 'When parking, your wheels should be:', ['Turned toward traffic', 'Turned away from traffic', 'Straight only', 'It does not matter'], 1, 'Wheels turned away from traffic so the car cannot roll into the road if brakes fail.'),

  // ── Traffic Lights ────────────────────────────────────────
  q('tl-1', 'traffic-lights', 'A red traffic light means:', ['Slow down', 'Stop', 'Proceed carefully', 'Sound horn and go'], 1, 'Red = stop. Always.'),
  q('tl-2', 'traffic-lights', 'A flashing amber light means:', ['Stop immediately', 'Proceed with caution', 'Speed up', 'It is broken — ignore it'], 1, 'Flashing amber = caution, proceed carefully.'),
  q('tl-3', 'traffic-lights', 'A green arrow pointing left means:', ['Turn left is protected — oncoming traffic must stop', 'You may never turn', 'Yield to everyone', 'It is only for pedestrians'], 0, 'A green arrow gives a protected turn.'),
  q('tl-4', 'traffic-lights', 'An amber light means:', ['Accelerate through', 'Prepare to stop', 'It is a decoration', 'Turn around'], 1, 'Amber warns you to prepare to stop — do not rush through.'),
  q('tl-5', 'traffic-lights', 'A standing red person on the pedestrian signal means:', ['Cross quickly', 'Do not cross', 'Look both ways only', 'Walk faster'], 1, 'Red standing figure = do not cross.'),

  // ── Safe Driving ──────────────────────────────────────────
  q('sd-1', 'safe-driving', 'The recommended minimum following distance is:', ['One car length', 'The two-second rule', 'No distance', 'One meter'], 1, 'Two seconds or more between vehicles.'),
  q('sd-2', 'safe-driving', 'Using a phone while driving is:', ['Allowed with hands-free only', 'Prohibited', 'Fine under 30 km/h', 'Allowed at night'], 1, 'Phone use while driving is prohibited — pull over.'),
  q('sd-3', 'safe-driving', 'Seatbelts are mandatory for:', ['Drivers only', 'All occupants', 'Front seats only', 'Nobody'], 1, 'Everyone in the vehicle must wear a seatbelt.'),
  q('sd-4', 'safe-driving', 'You may overtake on a solid yellow center line:', ['Always', 'Never', 'Only at night', 'Only on highways'], 1, 'Solid lines mean no overtaking.'),
  q('sd-5', 'safe-driving', 'Headlights should be used:', ['Only on highways', 'At night and in poor visibility', 'Never', 'Only in tunnels'], 1, 'Use headlights at night, in rain/fog and poor visibility.'),
];
