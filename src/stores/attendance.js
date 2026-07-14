import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TOTAL_HOUSES } from '@/lib/constants'

export const useAttendanceStore = defineStore('attendance', () => {
  const records = ref([])
  const meetingType = ref('agm')
  const meetingDate = ref('2026-07-20')

  const presentHouses = computed(() => {
    const set = new Set()
    records.value
      .filter(r => r.meeting_type === meetingType.value && r.meeting_date === meetingDate.value)
      .forEach(r => set.add(r.house_id))
    return set
  })

  const presentCount = computed(() => presentHouses.value.size)
  const attendanceRate = computed(() => Math.round((presentCount.value / TOTAL_HOUSES) * 100))
  const quorumReached = computed(() => presentCount.value >= Math.ceil(TOTAL_HOUSES / 2))

  function isPresent(houseId) {
    return presentHouses.value.has(houseId)
  }

  async function checkIn(houseId, memberName) {
    if (isPresent(houseId)) return
    records.value.push({
      id: `att-${Date.now()}`,
      house_id: houseId,
      member_id: null,
      meeting_type: meetingType.value,
      meeting_date: meetingDate.value,
      member_name: memberName,
      checked_in_at: new Date().toISOString(),
      checked_in_by: null
    })
  }

  return {
    records, meetingType, meetingDate,
    presentHouses, presentCount, attendanceRate, quorumReached,
    isPresent, checkIn
  }
})
