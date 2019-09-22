<template>
    <div>
        <Form :component="'FormAdministradores'"/>
    </div>
</template>

<script>
    import Form from '../../components/forms/Form'
    export default {
        components: {
            Form,
        }
    }
</script>
