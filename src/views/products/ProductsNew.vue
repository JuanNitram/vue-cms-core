<template>
    <div>
        <Form :component="'FormProductos'"/>
    </div>
</template>

<script>
    import Form from '../../components/forms/Form'
    export default {
        components: {
            Form,
        },
    }
</script>
