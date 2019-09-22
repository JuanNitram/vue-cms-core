<template>
    <div>
        <Form :component="'FormCategories'"/>
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
