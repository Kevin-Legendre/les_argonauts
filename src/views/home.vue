<template>
  <main>
    <h2 class="add-title">
      Ajouter un(e) Argonaute
      <span v-if="argonauts.length > 0" class="btn-delete" @click="deleteAll">
        <span class="btn-icon"></span>
        <p class="btn-text">Supprimer tout</p>
      </span>
    </h2>
    <form class="new-member-form">
      <label for="name">Nom de l&apos;Argonaute</label>
      <input
        v-model="argonautInput"
        type="text"
        placeholder="Charalampos"
        autofocus
        :class="{ 'form-input': true, 'form-error': error }"
      />
      <span v-if="error" class="error-message">{{ error }}</span>
      <button @click.prevent="submitForm">Envoyer</button>
    </form>

    <h2>Membres de l'équipage ({{ argonauts.length }})</h2>
    <Loader v-if="loading"/>
    <section class="list" v-else>
      <div class="member-list" v-if="argonauts.length > 0">
        <div
          v-for="argonaut in argonauts"
          :key="argonaut.id"
          class="member-item"
        >
          <div class="card card-edit" v-if="update && update.id === argonaut.id">
            <input
              v-model="update.name"
              :ref="argonaut.id"
              type="text"
              placeholder="Nom"
              @keyup.enter.prevent="submitEdit"
              @keyup.escape.prevent="cancel"
              :class="{ 'form-input': true, 'form-input-edit': true, 'form-error': updateError }"
            />
            <p v-if="updateError" class="input-error">{{ updateError }}</p>
            <span @click="submitEdit" class="edit-button check-icon" />
            <span @click="cancel" class="edit-button cancel-icon"/>
          </div>
          <div v-else class="card" @dblclick="edit(argonaut)">
            <p>{{ argonaut.name }}</p>
            <span class="edit" @click.self="edit(argonaut)"/>
          </div>
        </div>
      </div>
      <p v-else class="nothing">Aucun Argonaute enregistré</p>
    </section>
  </main>
</template>

<script>
import Loader from '@/components/loader'

export default {
  components: {
    Loader
  },
  data () {
    return {
      argonautInput: '',
      error: null,
      argonauts: [],
      loading: false,
      update: {},
      updateError: null
    }
  },
  watch: {
    argonautInput () {
      this.error = null
      const exist = this.argonauts.find((arg) => arg.name === this.argonautInput)
      if (exist) {
        this.error = 'Cet Argonaute existe déjà'
      }
    },
    'update.name' () {
      if (this.update) {
        this.updateError = null
        const exist = this.argonauts.find((arg) => arg.name === this.update.name && arg.id !== this.update.id)
        if (exist) {
          this.updateError = 'Cet Argonaute existe déjà'
        }
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      this.$api.get('/argonauts')
        .then((res) => {
          if (res.data) {
            setTimeout(() => {
              this.argonauts = res.data
              this.loading = false
            }, 500)
          }
        })
        .catch(() => {
          console.error('une erreur est survenue')
          this.loading = false
        })
    },
    submitForm () {
      if (this.argonautInput.length === 0) {
        this.error = 'Ce champ est requis'
        return
      }

      if (!this.error) {
        this.$api.post('/argonaut', { name: this.argonautInput })
          .then((res) => {
            if (res.data) {
              this.argonauts.unshift(res.data)
            }
            this.argonautInput = ''
          })
          .catch((err) => {
            if (err.toString().match(/409/)) {
              this.error = 'Cet argonaut existe déjà'
            }
          })
      }
    },
    edit (argonaut) {
      if (argonaut) {
        this.update = { ...argonaut }
        this.$nextTick(() => {
          this.$refs[argonaut.id][0].focus()
        })
      }
    },
    submitEdit () {
      if (!this.updateError) {
        this.$api.put('/argonaut/' + this.update.id, { name: this.update.name })
          .then((res) => res.data)
          .then((argonaut) => {
            this.argonauts.forEach((arg) => {
              if (arg.id === argonaut.id) {
                arg.name = argonaut.name
              }
            })
            this.cancel()
          })
          .catch((err) => {
            if (err.toString().match(/409/)) {
              this.updateError = 'Cet argonaut existe déjà'
            } else {
              console.error(err.toString())
            }
          })
      }
    },
    cancel () {
      if (this.update) {
        this.update = null
      }
    },
    deleteAll () {
      if (this.argonauts.length > 0) {
        this.loading = true
        this.$api.delete('argonauts')
          .then(() => {
            this.load()
          })
          .catch((err) => {
            console.error(err.toString())
          })
      }
    }
  },
  created () {
    this.load()
  }
}
</script>

<style lang="scss" scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 275px);
  h2.add-title {
    position: relative;
    span.btn-delete {
      position: absolute;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      right: 10px;
      border-radius: 3px;
      background-color: #ff5151;
      -webkit-transition: width .2s ease-in-out;
      transition: width .2s ease-in-out;
      cursor: pointer;
      .btn-icon {
        display: block;
        width: 20px;
        height: 20px;
        display: block;
        background-color: #fff;
        -webkit-mask: url(@/assets/close.svg) no-repeat center / contain;
        mask: url(@/assets/close.svg) no-repeat center / contain;
      }
      .btn-text {
        display: block;
        font-size: 0px;
        padding: 0;
        color: #fff;
        -webkit-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
      }
      &:hover {
        width: 140px;
        .btn-text {
          font-size: 14px;
          padding: 0 8px;
        }
      }
    }
  }
  .form-input {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: 14px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    height: 32px;
    line-height: 32px;
    &.form-error {
      border-color: #f44336;
    }
  }

  form.new-member-form {
    display: flex;
    flex-direction: column;
    max-width: 200px;
    margin: 0 auto;
    label {
      text-align: center;
    }
    .error-message {
      font-size: 12px;
      font-style: italic;
      color: #f44336;
      padding-left: 10px;
      margin: 5px 0 0;
    }
    button {
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      display: inline-block;
      line-height: 1;
      cursor: pointer;
      background-color: #F76B6B;
      border: 1px solid #F76B6B;
      color: #fff;
      -webkit-appearance: none;
      text-align: center;
      outline: none;
      margin-top: 10px;
      transition: .1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      &:hover {
        background-color: #fff;
        color: #F76B6B;
      }
    }
  }
  .nothing {
    display: block;
    margin: 0 auto;
    text-align: center;
  }
  .member-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 20px;
    gap: 10px 20px;
    .member-item {
      width: 30%;
      padding: 0.25em 0;
      position: relative;
      .card {
        height: 45px;
        background-color: #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-shadow: 5px 3px 9px 2px #0000000d;
        font-size: 14px;
        transition: all .3s ease;
        cursor: default;
        &:hover {
          background-color: #f3f2f2;
          .edit {
            background-color: #f76b6b7a;
          }
        }
        p {
          cursor: default;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 30px);
        }
        .edit {
          display: block;
          margin-left: 5px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          background-color: #d1d1d1;
          -webkit-mask: url(@/assets/edit.svg) no-repeat center / contain;
          mask: url(@/assets/edit.svg) no-repeat center / contain;
          transition: all .3s ease;
          &:hover {
            background-color: #f76b6b;
          }
        }
        .edit-button {
          display: block;
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: all .3s ease;
          opacity: .3;
          margin: 0 3px;
          &.check-icon {
            width: 18px;
            height: 18px;
            -webkit-mask: url(@/assets/check.svg) no-repeat center / contain;
            mask: url(@/assets/check.svg) no-repeat center / contain;
            background-color: #23c023;
          }
          &.cancel-icon {
            -webkit-mask: url(@/assets/close.svg) no-repeat center / contain;
            mask: url(@/assets/close.svg) no-repeat center / contain;
            background-color: #ff5151;
          }
          &:hover {
            opacity: 1;
            cursor: pointer;
          }
        }
        .form-input-edit {
          margin: 1em 5px 1em 0;
          height: 28px;
          padding-left: 5px;
        }
        .input-error {
          position: absolute;
          background-color: #f44336b5;
          bottom: -30px;
          right: 0;
          left: 0;
          padding: 5px 8px;
          text-align: center;
          z-index: 10;
          border-radius: 4px;
          font-size: 12px;
          font-style: italic;
          color: #fff;
          overflow: visible;
          &::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 10%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #f44336b5 transparent;
          }
        }
      }
    }
  }

}
</style>
