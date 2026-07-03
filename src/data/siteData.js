export const navItems = [
  { href: '#/', key: 'home', label: 'Home' },
  { href: '#/evolution', key: 'evolution', label: 'Evolution' },
  { href: '#/mechanical', key: 'mechanical', label: 'Mechanical' },
  { href: '#/technical', key: 'technical', label: 'Technical' },
  { href: '#/goats', key: 'goats', label: 'GOATs' }
];

export const eras = [
  {
    year: '1950s',
    title: 'Front-Engine Origins',
    description: 'Early Grand Prix cars placed the engine ahead of the driver, with narrow tyres, simple frames, and low aerodynamic understanding.',
    signature: 'Mechanical grip and engine durability',
    image: './assets/f1-era-1950s.png',
    alt: 'Generic 1950s front-engine Formula One car in a dark studio'
  },
  {
    year: '1960s',
    title: 'Rear-Engine Revolution',
    description: 'Packaging moved rearward, improving balance and traction. The monocoque chassis began replacing traditional spaceframe thinking.',
    signature: 'Weight distribution and compact chassis design',
    image: './assets/f1-era-1960s.png',
    alt: 'Generic 1960s rear-engine Formula One car in a dark studio'
  },
  {
    year: '1970s',
    title: 'Wings and Ground Effect',
    description: 'Teams discovered that air could be used as structure. Wings, side skirts, and shaped floors changed cornering speed dramatically.',
    signature: 'Downforce as a primary performance system',
    image: './assets/f1-era-1970s.png',
    alt: 'Generic 1970s wing and ground-effect Formula One car in a dark studio'
  },
  {
    year: '1980s',
    title: 'Turbo Power',
    description: 'Turbocharged engines delivered extreme power, forcing advances in cooling, fuel strategy, tyre loading, and chassis stiffness.',
    signature: 'Forced induction and thermal control',
    image: './assets/f1-era-1980s.png',
    alt: 'Generic 1980s turbo-era Formula One car in a dark studio'
  },
  {
    year: '1990s',
    title: 'Electronics and Active Control',
    description: 'Suspension, traction systems, semi-automatic shifting, and complex aero made the car a complete control platform.',
    signature: 'Electronic integration and systems thinking',
    image: './assets/f1-era-1990s.png',
    alt: 'Generic 1990s Formula One car from the electronics era in a dark studio'
  },
  {
    year: '2000s',
    title: 'Aero Complexity',
    description: 'Multi-element wings, turning vanes, bargeboards, and compact packaging defined a period of highly detailed airflow management.',
    signature: 'Surface-level flow conditioning',
    image: './assets/f1-era-2000s.png',
    alt: 'Generic 2000s complex-aero Formula One car in a dark studio'
  },
  {
    year: '2014+',
    title: 'Hybrid Efficiency',
    description: 'The V6 turbo-hybrid era made energy recovery, deployment maps, and thermal efficiency as important as raw combustion power.',
    signature: 'Combustion plus electrical recovery',
    image: './assets/f1-era-2014-hybrid.png',
    alt: 'Generic 2014 turbo-hybrid Formula One car in a dark studio'
  },
  {
    year: '2022+',
    title: 'Modern Ground Effect',
    description: 'Regulations shifted emphasis back under the car, with sculpted floors, simplified upper surfaces, and wake-sensitive racing design.',
    signature: 'Underfloor load and cleaner wake behavior',
    image: './assets/f1-era-2022-ground-effect.png',
    alt: 'Generic 2022 ground-effect Formula One car in a dark studio'
  }
];

export const mechanicalSystems = [
  ['01', 'Carbon Monocoque', 'The survival cell carries suspension loads, protects the driver, and forms the central structural reference for the complete car.', './assets/mech-monocoque.png', 'Formula One carbon monocoque survival cell in a dark studio'],
  ['02', 'Front Wing', 'Multi-element carbon profiles create front load and condition airflow toward the floor, tyres, and sidepod entry.', './assets/mech-front-wing.png', 'Formula One multi-element front wing assembly in a dark studio'],
  ['03', 'Suspension', 'Wishbones, pushrods, rockers, springs, and dampers manage platform control while minimizing aerodynamic blockage.', './assets/mech-suspension.png', 'Formula One suspension wishbones and hub assembly in a dark studio'],
  ['04', 'Brake System', 'Carbon discs, calipers, ducts, and drums convert extreme speed into heat while controlling tyre temperature and airflow.', './assets/mech-brakes.png', 'Formula One carbon brake system in a dark studio'],
  ['05', 'Cooling Package', 'Radiators, charge coolers, oil coolers, and ducts are packaged inside the sidepods with minimal drag penalty.', './assets/mech-cooling.png', 'Formula One cooling radiators and ducting package in a dark studio'],
  ['06', 'Power Unit Mounting', 'The engine is a stressed member connected to the monocoque and gearbox, carrying rear suspension and aerodynamic loads.', './assets/mech-power-unit.png', 'Formula One turbo hybrid power unit mounted to the rear structure'],
  ['07', 'Gearbox Cassette', 'An eight-speed seamless-shift transmission transfers hybrid power while forming part of the rear structure.', './assets/mech-gearbox.png', 'Formula One gearbox cassette and differential assembly in a dark studio'],
  ['08', 'Rear Wing and Diffuser', 'The rear aero group balances drag, downforce, DRS performance, and pressure recovery from the underfloor.', './assets/mech-rear-aero.png', 'Formula One rear wing and diffuser assembly in a dark studio']
];

export const technicalSystems = [
  ['Aerodynamic Platform', 'Ride height, rake, floor edge sealing, and wing balance decide how much usable downforce the car can keep through a corner.', './assets/tech-aero-platform.png', 'Formula One aerodynamic airflow visualization in a wind tunnel'],
  ['Hybrid Deployment', 'The MGU-K recovers braking energy and redeploys it through acceleration zones, managed by lap-specific energy maps.', './assets/tech-hybrid-deployment.png', 'Formula One hybrid energy deployment visualization'],
  ['Thermal Management', 'Cooling ducts, bodywork exits, and radiator sizing trade drag against power-unit, gearbox, brake, and battery temperature control.', './assets/tech-thermal-management.png', 'Formula One thermal management and cooling visualization'],
  ['Tyre Operating Window', 'Suspension geometry, brake migration, camber, pressure, and downforce keep the contact patch inside a narrow performance range.', './assets/tech-tyre-window.png', 'Formula One tyre operating window visualization'],
  ['Vehicle Dynamics', 'Differential settings, brake balance, suspension stiffness, and aero load distribution shape entry stability and traction.', './assets/tech-vehicle-dynamics.png', 'Formula One vehicle dynamics visualization'],
  ['Race Control Data', 'Telemetry turns driver input, sensor data, and track evolution into setup decisions before and during each session.', './assets/tech-race-control.png', 'Formula One race control telemetry visualization']
];
