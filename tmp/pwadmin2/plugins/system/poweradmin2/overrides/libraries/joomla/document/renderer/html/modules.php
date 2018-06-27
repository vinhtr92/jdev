<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Document
 *
 * @copyright   Copyright (C) 2005 - 2017 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * JDocument Modules renderer
 *
 * @since  3.5
 */
class JDocumentRendererHtmlModules extends JDocumentRenderer
{
	/**
	 * Renders multiple modules script and returns the results as a string
	 *
	 * @param   string  $position  The position of the modules to render
	 * @param   array   $params    Associative array of values
	 * @param   string  $content   Module content
	 *
	 * @return  string  The output of the script
	 *
	 * @since   3.5
	 */
	public function render($position, $params = array(), $content = null)
	{
		// <!-- Modified to support Site Manager feature of JSN PowerAdmin :: Begin
		JFactory::getApplication()->triggerEvent( 'onBeforeRenderModulePosition', array($position, &$params, &$content) );
		// Modified to support Site Manager feature of JSN PowerAdmin :: End -->

		$renderer = $this->_doc->loadRenderer('module');
		$buffer   = '';

		$app          = JFactory::getApplication();
		$user         = JFactory::getUser();
		// <!-- Modified to support Site Manager feature of JSN PowerAdmin :: Begin
		/*
		$frontediting = ($app->isClient('site') && $app->get('frontediting', 1) && !$user->guest);
		*/
		$frontediting = (((method_exists($app, 'isClient') && $app->isClient('site')) || $app->isSite()) && $app->get('frontediting', 1) && !$user->guest);
		// Modified to support Site Manager feature of JSN PowerAdmin :: End -->
		$menusEditing = ($app->get('frontediting', 1) == 2) && $user->authorise('core.edit', 'com_menus');

		foreach (JModuleHelper::getModules($position) as $mod)
		{
			$moduleHtml = $renderer->render($mod, $params, $content);

			if ($frontediting && trim($moduleHtml) != '' && $user->authorise('module.edit.frontend', 'com_modules.module.' . $mod->id))
			{
				$displayData = array('moduleHtml' => &$moduleHtml, 'module' => $mod, 'position' => $position, 'menusediting' => $menusEditing);
				JLayoutHelper::render('joomla.edit.frontediting_modules', $displayData);
			}

			$buffer .= $moduleHtml;
		}

		JFactory::getApplication()->triggerEvent('onAfterRenderModules', array(&$buffer, &$params));

		// <!-- Modified to support Site Manager feature of JSN PowerAdmin :: Begin
		JFactory::getApplication()->triggerEvent( 'onAfterRenderModulePosition', array($position, &$params, &$buffer) );
		// Modified to support Site Manager feature of JSN PowerAdmin :: End -->

		return $buffer;
	}
}