<script setup lang="ts">
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { NInput, NSelect, NButton, NIcon } from 'naive-ui'
import { TrashOutline } from '@vicons/ionicons5'
import type { AccountType, Account } from './../types/account'
import { parseLabelsInput } from './../utils/labels'
import { validateLabelsInput, validateLogin, validatePassword } from './../utils/validation'
import { uid } from './../utils/uid'

type Initial = {
  id?: string
  labelsInput?: string
  type?: AccountType
  login?: string
  password?: string | null
  isSaved?: boolean
}

const props = defineProps<{ initial?: Initial }>()
const emit = defineEmits<{
  (e: 'save', account: Account): void
  (e: 'delete', payload: { id: string; isSaved: boolean }): void
}>()

const state = reactive({
  id: props.initial?.id ?? uid(),
  labelsInput: props.initial?.labelsInput ?? '',
  type: (props.initial?.type ?? 'Local') as AccountType,
  login: props.initial?.login ?? '',
  password: props.initial?.password === null ? '' : props.initial?.password ?? '',
  isSaved: props.initial?.isSaved ?? false,
  errors: { labels: null as string | null, login: null as string | null, password: null as string | null }
})

const isLDAP = computed(() => state.type === 'LDAP')

const labelsRef = ref<InstanceType<typeof NInput> | null>(null)

onMounted(() => {
  if (!state.isSaved) {
    labelsRef.value?.focus()
  }
})

watch(() => state.type, () => {
  if (isLDAP.value) {
    state.password = ''
    state.errors.password = null
  }
  trySave()
})

function validateAll() {
  state.errors.labels = validateLabelsInput(state.labelsInput)
  state.errors.login = validateLogin(state.login)
  state.errors.password = validatePassword(state.type, state.password)
  return !state.errors.labels && !state.errors.login && !state.errors.password
}

function buildAccount(): Account {
  return {
    id: state.id,
    labels: parseLabelsInput(state.labelsInput),
    type: state.type,
    login: state.login.trim(),
    password: state.type === 'LDAP' ? null : state.password
  }
}

function trySave() {
  if (validateAll()) {
    emit('save', buildAccount())
    state.isSaved = true
  }
}

function onBlurText() {
  trySave()
}

function onDelete() {
  emit('delete', { id: state.id, isSaved: state.isSaved })
}
</script>

<template>
  <div class="accounts__row" :class="{ 'accounts__row--ldap': isLDAP }">
    <!-- Метки -->
    <div class="accounts__cell accounts__cell--labels">
      <n-input
          ref="labelsRef"
          v-model:value="state.labelsInput"
          :maxlength="50"
          placeholder="пример: prod; admin"
          aria-label="Метки"
          :status="state.errors.labels ? 'error' : undefined"
          @blur="onBlurText"
      />
      <div v-if="state.errors.labels" class="accounts__error">{{ state.errors.labels }}</div>
    </div>

    <!-- Тип записи -->
    <div class="accounts__cell accounts__cell--type">
      <n-select
          v-model:value="state.type"
          aria-label="Тип записи"
          :options="[
          { label: 'LDAP', value: 'LDAP' },
          { label: 'Локальная', value: 'Local' }
        ]"
      />
    </div>

    <!-- Логин -->
    <div class="accounts__cell accounts__cell--login accounts__cell--stack">
      <n-input
          v-model:value="state.login"
          :maxlength="100"
          placeholder="логин"
          aria-label="Логин"
          :status="state.errors.login ? 'error' : undefined"
          @blur="onBlurText"
      />
      <div v-if="state.errors.login" class="accounts__error">{{ state.errors.login }}</div>
    </div>

    <!-- Пароль скрываем для LDAP -->
    <div class="accounts__cell accounts__cell--password accounts__cell--stack">
      <n-input
          v-if="!isLDAP"
          v-model:value="state.password"
          type="password"
          show-password-on="mousedown"
          :maxlength="100"
          placeholder="пароль"
          aria-label="Пароль"
          :status="state.errors.password ? 'error' : undefined"
          @blur="onBlurText"
      />
      <div v-if="!isLDAP && state.errors.password" class="accounts__error">{{ state.errors.password }}</div>
    </div>

    <!-- Действия -->
    <div class="accounts__cell accounts__cell--actions">
      <n-button tertiary type="error" @click="onDelete" title="Удалить" aria-label="Удалить запись">
        <n-icon><TrashOutline /></n-icon>
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.accounts__row--ldap .accounts__cell--login {
  grid-column: 3 / span 2;
}
.accounts__row--ldap .accounts__cell--password {
  display: none; }

.accounts__cell--actions {
  margin-left: auto;
}

.accounts__cell--stack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.accounts__error {
  line-height: 10px;
  font-size: 10px;
  color: #dc2626;
}
</style>