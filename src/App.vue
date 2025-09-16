<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NAlert, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import AccountRow from './components/AccountRow.vue'
import { useAccountsStore } from './stores/accounts'
import { uid } from './utils/uid'
import { labelsToInput } from './utils/labels'
import type { Account } from './types/account'

type Draft = { id: string }
const store = useAccountsStore()
const drafts = ref<Draft[]>([])

function addDraft() { drafts.value.push({ id: uid() }) }
function handleSave(a: Account) {
  store.upsert(a)
  drafts.value = drafts.value.filter(d => d.id !== a.id)
}
function handleDelete(payload: { id: string; isSaved: boolean }) {
  if (payload.isSaved) store.remove(payload.id)
  drafts.value = drafts.value.filter(d => d.id !== payload.id)
}
</script>

<template>
  <div class="accounts">
    <header class="accounts__header">
      <h1 class="accounts__title">Учетные записи</h1>
      <n-button class="accounts__add" type="primary" round @click="addDraft">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        Добавить
      </n-button>
    </header>

    <n-alert class="accounts__hint" type="info" :show-icon="true">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </n-alert>

    <section class="accounts__list">
      <div v-if="store.accounts.length === 0 && drafts.length === 0" class="accounts__empty">
        Нет учетных записей. Нажмите «Добавить».
      </div>

      <div v-else class="accounts__head">
        <div class="accounts__th accounts__th--labels">Метки</div>
        <div class="accounts__th accounts__th--type">Тип записи</div>
        <div class="accounts__th accounts__th--login">Логин</div>
        <div class="accounts__th accounts__th--password">Пароль</div>
        <div class="accounts__th accounts__th--actions"></div>
      </div>

      <AccountRow
          v-for="a in store.accounts"
          :key="a.id"
          :initial="{
          id: a.id,
          labelsInput: labelsToInput(a.labels),
          type: a.type,
          login: a.login,
          password: a.password,
          isSaved: true
        }"
          @save="handleSave"
          @delete="handleDelete"
      />

      <AccountRow
          v-for="d in drafts"
          :key="d.id"
          :initial="{ id: d.id, isSaved: false }"
          @save="handleSave"
          @delete="handleDelete"
      />
    </section>
  </div>
</template>

<style>
.accounts { max-width: 960px; margin: 24px auto; padding: 0 16px; }
.accounts__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.accounts__title { margin: 0; font-size: 24px; line-height: 1.2; }
.accounts__hint { margin-top: 12px; }

.accounts__head {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr 1fr 72px;
  gap: 12px;
  padding: 0 12px;
  color: #64748b;
  font-size: 12px;
}
.accounts__th { display: flex; align-items: center; }

.accounts__list { margin-top: 8px; display: grid; gap: 12px; }
.accounts__empty { opacity: 0.7; font-size: 14px; }

.accounts__row {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 1fr 1fr 60px;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}
.accounts__cell { display: flex; align-items: center; }
</style>