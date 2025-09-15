<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NAlert, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'

interface TempAccount {
  id: string
}

const accounts = ref<TempAccount[]>([])

const addAccount = () => {
  const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : String(Date.now() + Math.random())
  accounts.value.push({ id })
}
</script>

<template>
  <div class="page">
    <header class="header">
      <h1 class="title">Учетные записи</h1>

      <n-button type="primary" round @click="addAccount">
        <template #icon>
          <n-icon>
            <AddOutline />
          </n-icon>
        </template>
        Добавить
      </n-button>
    </header>

    <n-alert type="info" :show-icon="true" class="hint">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </n-alert>

    <section class="list">
      <div v-if="accounts.length === 0" class="empty">
        Нет учетных записей. Нажмите «Добавить».
      </div>

      <!-- Скелет строки. В следующих коммитах добавим поля и логику. -->
      <div v-for="a in accounts" :key="a.id" class="row skeleton">
        <div class="cell label">Метки</div>
        <div class="cell type">Тип записи</div>
        <div class="cell login">Логин</div>
        <div class="cell password">Пароль</div>
        <div class="cell actions">Действия</div>
      </div>
    </section>
  </div>
</template>

<style>
.page { max-width: 960px; margin: 24px auto; padding: 0 16px; }
.header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.title { font-size: 24px; line-height: 1.2; margin: 0; }
.hint { margin-top: 12px; }
.list { margin-top: 16px; display: grid; gap: 12px; }
.empty { opacity: 0.7; font-size: 14px; }

.row { display: grid; grid-template-columns: 1.3fr 0.8fr 1fr 1fr 64px; gap: 12px;
  padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
.row.skeleton .cell { min-height: 38px; display: flex; align-items: center; padding: 0 8px;
  background: #f8fafc; border-radius: 6px; font-size: 12px; color: #64748b; }
</style>