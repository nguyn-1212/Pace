package com.lazy.travel.presentation.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.lazy.travel.core.theme.LtColors

// ── Standard TextField ────────────────────────────────────────────────────
@Composable
fun LtTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    hint: String = "",
    leadingIcon: ImageVector? = null,
    trailingIcon: ImageVector? = null,
    onTrailingIconClick: (() -> Unit)? = null,
    isError: Boolean = false,
    errorText: String? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    maxLines: Int = 1,
    keyboardType: KeyboardType = KeyboardType.Text,
    imeAction: ImeAction = ImeAction.Next,
    onImeAction: (() -> Unit)? = null,
) {
    Column(modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label, style = MaterialTheme.typography.bodyMedium) },
            placeholder = if (hint.isNotEmpty()) {
                { Text(hint, style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray2) }
            } else null,
            leadingIcon = leadingIcon?.let {
                { Icon(it, contentDescription = null, tint = if (isError) LtColors.Error else LtColors.Gray) }
            },
            trailingIcon = trailingIcon?.let {
                {
                    IconButton(onClick = { onTrailingIconClick?.invoke() }) {
                        Icon(it, contentDescription = null, tint = LtColors.Gray)
                    }
                }
            },
            isError = isError,
            enabled = enabled,
            readOnly = readOnly,
            singleLine = singleLine,
            maxLines = maxLines,
            keyboardOptions = KeyboardOptions(
                keyboardType = keyboardType,
                imeAction = imeAction
            ),
            keyboardActions = KeyboardActions(
                onNext = { onImeAction?.invoke() },
                onDone = { onImeAction?.invoke() },
                onSearch = { onImeAction?.invoke() }
            ),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = LtColors.Pink,
                focusedLabelColor = LtColors.Pink,
                focusedLeadingIconColor = LtColors.Pink,
                unfocusedBorderColor = LtColors.Border,
                unfocusedLabelColor = LtColors.Gray,
                errorBorderColor = LtColors.Error,
                errorLabelColor = LtColors.Error,
                cursorColor = LtColors.Pink,
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
            ),
            textStyle = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.fillMaxWidth()
        )

        if (isError && !errorText.isNullOrEmpty()) {
            Text(
                text = errorText,
                style = MaterialTheme.typography.labelSmall,
                color = LtColors.Error,
                modifier = Modifier.padding(start = 12.dp, top = 4.dp)
            )
        }
    }
}

// ── Password TextField ────────────────────────────────────────────────────
@Composable
fun LtPasswordTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    hint: String = "",
    isError: Boolean = false,
    errorText: String? = null,
    imeAction: ImeAction = ImeAction.Done,
    onImeAction: (() -> Unit)? = null,
) {
    var passwordVisible by remember { mutableStateOf(false) }

    Column(modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label, style = MaterialTheme.typography.bodyMedium) },
            placeholder = if (hint.isNotEmpty()) {
                { Text(hint, style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray2) }
            } else null,
            visualTransformation = if (passwordVisible)
                VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Text(
                        if (passwordVisible) "🙈" else "👁️",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            isError = isError,
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = imeAction
            ),
            keyboardActions = KeyboardActions(
                onDone = { onImeAction?.invoke() }
            ),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = LtColors.Pink,
                focusedLabelColor = LtColors.Pink,
                unfocusedBorderColor = LtColors.Border,
                unfocusedLabelColor = LtColors.Gray,
                errorBorderColor = LtColors.Error,
                cursorColor = LtColors.Pink,
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
            ),
            textStyle = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.fillMaxWidth()
        )

        if (isError && !errorText.isNullOrEmpty()) {
            Text(
                text = errorText,
                style = MaterialTheme.typography.labelSmall,
                color = LtColors.Error,
                modifier = Modifier.padding(start = 12.dp, top = 4.dp)
            )
        }
    }
}

// ── OTP TextField (6 boxes) ───────────────────────────────────────────────
@Composable
fun LtOtpField(
    otp: String,
    onOtpChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    length: Int = 6,
    isError: Boolean = false,
) {
    // Simple implementation - could be enhanced with individual boxes
    OutlinedTextField(
        value = otp,
        onValueChange = { if (it.length <= length && it.all { c -> c.isDigit() }) onOtpChange(it) },
        modifier = modifier.fillMaxWidth(),
        singleLine = true,
        isError = isError,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.NumberPassword,
            imeAction = ImeAction.Done
        ),
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = LtColors.Pink,
            unfocusedBorderColor = LtColors.Border,
            errorBorderColor = LtColors.Error,
            cursorColor = LtColors.Pink,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White,
        ),
        textStyle = MaterialTheme.typography.headlineMedium.copy(
            color = LtColors.Dark,
            letterSpacing = 8.dp.value.let { androidx.compose.ui.unit.TextUnit(it * 0.5f, androidx.compose.ui.unit.TextUnitType.Sp) }
        ),
        placeholder = {
            Text("------", style = MaterialTheme.typography.headlineMedium.copy(color = LtColors.Gray2))
        }
    )
}
