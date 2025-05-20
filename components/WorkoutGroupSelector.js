import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';

const workoutSections = [
  {
    title: 'Lower Body & Legs',
    data: [
      'Legs',
      'Quadriceps',
      'Hamstrings',
      'Glutes',
      'Calves',
      'Hip Mobility',
      'Plyometrics',
      'Jump Training',
      'Sled Push/Pull',
    ],
  },
  {
    title: 'Upper Body - Chest',
    data: [
      'Chest',
      'Upper Chest',
      'Lower Chest',
      'Push-Ups',
      'Chest Flys',
    ],
  },
  {
    title: 'Upper Body - Back',
    data: [
      'Back',
      'Upper Back',
      'Lower Back',
      'Lats',
      'Traps',
      'Deadlifts',
      'Rows',
      'Pull-Ups & Chin-Ups',
    ],
  },
  {
    title: 'Shoulders',
    data: [
      'Shoulders',
      'Deltoids',
      'Rotator Cuff',
      'Overhead Press',
      'Lateral Raises',
    ],
  },
  {
    title: 'Arms',
    data: [
      'Biceps',
      'Triceps',
      'Forearms',
      'Curls',
      'Dips',
      'Hammer Curls',
    ],
  },
  {
    title: 'Core & Abs',
    data: [
      'Core',
      'Abs',
      'Obliques',
      'Lower Back Core',
      'Planks',
      'Hanging Leg Raises',
      'Russian Twists',
      'Cable Woodchoppers',
    ],
  },
  {
    title: 'Strength & Power Training',
    data: [
      'Strength Training',
      'Powerlifting',
      'Olympic Weightlifting',
      'Strongman',
      'Kettlebell Training',
      'Barbell Training',
      'Dumbbell Training',
      'Bodyweight Strength',
      'German Volume Training',
      'Blood Flow Restriction Training',
      'Animal Flow',
      'Primal Movement',
    ],
  },
  {
    title: 'Functional & Athletic Training',
    data: [
      'Functional Training',
      'Athletic Conditioning',
      'Speed & Agility',
      'Balance Training',
      'Coordination Drills',
      'Explosive Training',
      'Sprint Training',
      'Obstacle Course Training',
    ],
  },
  {
    title: 'Endurance & Cardio',
    data: [
      'Cardio',
      'Running',
      'Distance Running',
      'Sprinting',
      'Cycling',
      'Mountain Biking',
      'Swimming',
      'Rowing',
      'Jump Rope',
      'Elliptical',
      'Stair Climbing',
      'Hiking',
      'Trail Running',
      'Skating',
      'Skiing',
      'Snowboarding',
    ],
  },
  {
    title: 'High Intensity & Conditioning',
    data: [
      'HIIT',
      'CrossFit',
      'Tabata',
      'Circuit Training',
      'Bootcamp',
      'Metabolic Conditioning',
      'Interval Training',
      'Boxing Conditioning',
      'Martial Arts Conditioning',
    ],
  },
  {
    title: 'Mobility, Flexibility & Recovery',
    data: [
      'Mobility',
      'Yoga',
      'Pilates',
      'Dynamic Stretching',
      'Static Stretching',
      'Foam Rolling',
      'Myofascial Release',
      'Breathing Exercises',
      'Meditation',
      'Recovery Workouts',
      'Active Recovery',
      'Prehabilitation Exercises',
      'Postural Correction',
    ],
  },
  {
    title: 'Wellness & Alternative Modalities',
    data: [
      'Sauna',
      'Cold Plunge',
      'Red Light Therapy',
      'Massage',
      'Chiropractic',
      'Acupuncture',
      'Hydrotherapy',
      'Tai Chi',
      'Qigong',
      'Pneumatic Compression',
      'Cryotherapy',
      'Float Tanks',
    ],
  },
  {
    title: 'Sports Specific Training',
    data: [
      'Basketball',
      'Football',
      'Soccer',
      'Tennis',
      'Golf',
      'Baseball',
      'Volleyball',
      'Swimming Training',
      'Track & Field',
      'Ski Training',
      'Fencing',
      'Archery',
      'Dance',
      'Rock Climbing (Bouldering)',
      'Rock Climbing (Sport)',
    ],
  },
  {
    title: 'Outdoor & Adventure Training',
    data: [
      'Outdoor Workouts',
      'Trail Running',
      'Rock Climbing',
      'Kayaking',
      'Canoeing',
      'Backpacking',
      'Orienteering',
      'Surfing',
    ],
  },
  {
    title: 'Specialized Equipment Training',
    data: [
      'TRX Suspension Training',
      'Battle Ropes',
      'Sled Training',
      'Sandbag Training',
      'Gymnastics Rings',
      'Resistance Bands',
      'Cable Machines',
      'Stepper Machines',
      'Vibration Plates',
    ],
  },
  {
    title: 'Mind-Body & Relaxation',
    data: [
      'Mindfulness',
      'Stress Relief',
      'Sleep Optimization',
      'Guided Relaxation',
    ],
  },
  {
    title: 'Adaptive & Specialized Fitness',
    data: [
      'Adaptive Fitness',
      'Rehabilitation',
      'Youth Fitness',
      'Senior Fitness',
      'Pre/Post Natal Fitness',
    ],
  },
  {
    title: 'Group Fitness Classes',
    data: [
      'Zumba',
      'Barre',
      'Spin Classes',
      'Aqua Aerobics',
      'Step Aerobics',
    ],
  },
  {
    title: 'Emerging & Tech-Based Fitness',
    data: [
      'Virtual Reality Workouts',
      'Exergaming',
      'AI-Assisted Training',
    ],
  },
];

const WorkoutGroupSelector = ({ navigation }) => {
  const handleSelectGroup = (group) => {
    navigation.navigate('Discover', { selectedGroup: group });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Workout Group</Text>
      <SectionList
        sections={workoutSections}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupButton}
            onPress={() => handleSelectGroup(item)}
            accessibilityRole="button"
            accessibilityLabel={`Select workout group ${item}`}
          >
            <Text style={styles.groupText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF',
  },
  groupButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  groupText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default WorkoutGroupSelector;